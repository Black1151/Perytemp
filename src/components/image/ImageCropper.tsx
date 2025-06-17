"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";

interface Crop {
  x: number;
  y: number;
  size: number;
}

interface ImageCropperProps {
  file: File | null;
  isOpen: boolean;
  onComplete: (file: File) => void;
  onCancel: () => void;
}

// Utility to create File from canvas content
const canvasToFile = async (
  canvas: HTMLCanvasElement,
  fileName: string,
  type = "image/jpeg"
): Promise<File> => {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(new File([blob!], fileName, { type }));
      },
      type,
      0.9
    );
  });
};

export default function ImageCropper({
  file,
  isOpen,
  onComplete,
  onCancel,
}: ImageCropperProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [imgUrl, setImgUrl] = useState<string>("");
  const [crop, setCrop] = useState<Crop>({ x: 10, y: 10, size: 80 });
  const [dragging, setDragging] = useState<boolean>(false);
  const [resizing, setResizing] = useState<boolean>(false);
  const [start, setStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [bounds, setBounds] = useState({
    offsetX: 0,
    offsetY: 0,
    width: 0,
    height: 0,
    scale: 1,
    containerWidth: 0,
    containerHeight: 0,
  });

  useEffect(() => {
    if (file) {
      setImgUrl(URL.createObjectURL(file));
    } else {
      setImgUrl("");
    }
  }, [file]);

  // compute displayed image bounds
  useEffect(() => {
    const updateBounds = () => {
      if (!imgRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const nW = imgRef.current.naturalWidth;
      const nH = imgRef.current.naturalHeight;
      const scale = Math.min(rect.width / nW, rect.height / nH);
      const width = nW * scale;
      const height = nH * scale;
      const offsetX = (rect.width - width) / 2;
      const offsetY = (rect.height - height) / 2;
      setBounds({
        offsetX,
        offsetY,
        width,
        height,
        scale,
        containerWidth: rect.width,
        containerHeight: rect.height,
      });
    };
    updateBounds();
    window.addEventListener("resize", updateBounds);
    return () => window.removeEventListener("resize", updateBounds);
  }, [imgUrl]);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setStart({ x: e.clientX, y: e.clientY });
    const target = e.target as HTMLElement;
    if (target.dataset.type === "resize") {
      setResizing(true);
    } else {
      setDragging(true);
    }
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging && !resizing) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    setStart({ x: e.clientX, y: e.clientY });
    setCrop((c) => {
      if (!containerRef.current) return c;
      const rect = containerRef.current.getBoundingClientRect();
      const { offsetX, offsetY, width, height, containerWidth } = bounds;
      const sizePx = (c.size / 100) * rect.width;
      if (resizing) {
        let newSizePx = sizePx + dx + dy;
        newSizePx = Math.max(20, Math.min(newSizePx, Math.min(width, height)));
        const newSize = (newSizePx / rect.width) * 100;
        return { ...c, size: newSize };
      }
      let newXpx = (c.x / 100) * rect.width + dx;
      let newYpx = (c.y / 100) * rect.height + dy;
      newXpx = Math.max(offsetX, Math.min(newXpx, offsetX + width - sizePx));
      newYpx = Math.max(offsetY, Math.min(newYpx, offsetY + height - sizePx));
      const newX = (newXpx / rect.width) * 100;
      const newY = (newYpx / rect.height) * 100;
      return { ...c, x: newX, y: newY };
    });
  };

  const onMouseUp = () => {
    setDragging(false);
    setResizing(false);
  };

  const handleComplete = async () => {
    if (!imgRef.current || !file || !containerRef.current) return;
    const img = imgRef.current;
    const rect = containerRef.current.getBoundingClientRect();
    const { offsetX, offsetY, scale } = bounds;
    const cropX = (crop.x / 100) * rect.width;
    const cropY = (crop.y / 100) * rect.height;
    const cropSize = (crop.size / 100) * rect.width;
    const sx = (cropX - offsetX) / scale;
    const sy = (cropY - offsetY) / scale;
    const sSize = cropSize / scale;
    const canvas = document.createElement("canvas");
    canvas.width = sSize;
    canvas.height = sSize;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(
        img,
        sx,
        sy,
        sSize,
        sSize,
        0,
        0,
        canvas.width,
        canvas.height
      );
    }
    let newFile = await canvasToFile(canvas, file.name, file.type);
    // ensure <10MB
    let quality = 0.9;
    while (newFile.size > 10 * 1024 * 1024 && quality > 0.1) {
      quality -= 0.1;
      newFile = await new Promise<File>((resolve) => {
        canvas.toBlob(
          (blob) => {
            resolve(new File([blob!], file.name, { type: file.type }));
          },
          file.type,
          quality
        );
      });
    }
    onComplete(newFile);
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Crop Image</ModalHeader>
        <ModalBody>
          {imgUrl && (
            <div
              ref={containerRef}
              style={{ position: "relative", width: "100%", height: 400 }}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
            >
              <img
                ref={imgRef}
                src={imgUrl}
                alt="crop"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
              <div
                onMouseDown={onMouseDown}
                style={{
                  border: "2px solid #fff",
                  position: "absolute",
                  left: bounds.offsetX + (crop.x / 100) * bounds.containerWidth,
                  top: bounds.offsetY + (crop.y / 100) * bounds.containerHeight,
                  width: (crop.size / 100) * bounds.containerWidth,
                  height: (crop.size / 100) * bounds.containerWidth,
                  cursor: dragging ? "grabbing" : "grab",
                }}
              >
                <div
                  data-type="resize"
                  style={{
                    position: "absolute",
                    width: 10,
                    height: 10,
                    right: -5,
                    bottom: -5,
                    background: "#fff",
                    cursor: "nwse-resize",
                  }}
                  onMouseDown={onMouseDown}
                />
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onCancel}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleComplete}>
            Crop
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
