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

  useEffect(() => {
    if (file) {
      setImgUrl(URL.createObjectURL(file));
    } else {
      setImgUrl("");
    }
  }, [file]);

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
      const maxX = 100;
      const maxY = 100;
      if (resizing) {
        let newSize = c.size + ((dx + dy) / rect.width) * 100;
        newSize = Math.max(10, Math.min(newSize, 100));
        return { ...c, size: newSize };
      }
      let newX = c.x + (dx / rect.width) * 100;
      let newY = c.y + (dy / rect.height) * 100;
      newX = Math.max(0, Math.min(newX, maxX - c.size));
      newY = Math.max(0, Math.min(newY, maxY - c.size));
      return { ...c, x: newX, y: newY };
    });
  };

  const onMouseUp = () => {
    setDragging(false);
    setResizing(false);
  };

  const handleComplete = async () => {
    if (!imgRef.current || !containerRef.current || !file) return;
    const img = imgRef.current;
    const container = containerRef.current;

    const contW = container.clientWidth;
    const contH = container.clientHeight;

    const displayedW = img.width;
    const displayedH = img.height;
    const offsetX = (contW - displayedW) / 2;
    const offsetY = (contH - displayedH) / 2;

    const scaleX = img.naturalWidth / displayedW;
    const scaleY = img.naturalHeight / displayedH;

    const cropPx = {
      x: (crop.x / 100) * contW - offsetX,
      y: (crop.y / 100) * contH - offsetY,
      size: (crop.size / 100) * contW,
    };

    cropPx.x = Math.max(0, Math.min(cropPx.x, displayedW - cropPx.size));
    cropPx.y = Math.max(0, Math.min(cropPx.y, displayedH - cropPx.size));

    const sx = cropPx.x * scaleX;
    const sy = cropPx.y * scaleY;
    const sSize = cropPx.size * scaleX;

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
              style={{
                position: "relative",
                width: 400,
                height: 400,
                margin: "0 auto",
              }}
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
                  left: `${crop.x}%`,
                  top: `${crop.y}%`,
                  width: `${crop.size}%`,
                  height: `${crop.size}%`,
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
