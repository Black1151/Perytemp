"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

interface ImageCropperProps {
  file: File | null;
  isOpen: boolean;
  onComplete: (file: File) => void;
  onClose: () => void;
  /** Target width for the final image */
  targetWidth?: number;
  /** Target height for the final image */
  targetHeight?: number;
}

export default function ImageCropper({
  file,
  isOpen,
  onComplete,
  onClose,
  targetWidth = 800,
  targetHeight = 800,
}: ImageCropperProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [imgUrl, setImgUrl] = useState<string>("");
  const cropSize = 300; // square crop box
  const [cropPos, setCropPos] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null,
  );

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImgUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragStart({ x: e.clientX - cropPos.x, y: e.clientY - cropPos.y });
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragStart) return;
    e.preventDefault();
    const cont = containerRef.current;
    if (!cont) return;
    let newX = e.clientX - dragStart.x;
    let newY = e.clientY - dragStart.y;
    const maxX = cont.clientWidth - cropSize;
    const maxY = cont.clientHeight - cropSize;
    if (newX < 0) newX = 0;
    if (newY < 0) newY = 0;
    if (newX > maxX) newX = maxX;
    if (newY > maxY) newY = maxY;
    setCropPos({ x: newX, y: newY });
  };

  const onMouseUp = () => setDragStart(null);

  const handleCrop = async () => {
    if (!imgRef.current || !file) return;
    const img = imgRef.current;
    const scaleX = img.naturalWidth / img.clientWidth;
    const scaleY = img.naturalHeight / img.clientHeight;
    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(
      img,
      cropPos.x * scaleX,
      cropPos.y * scaleY,
      cropSize * scaleX,
      cropSize * scaleY,
      0,
      0,
      targetWidth,
      targetHeight,
    );

    let quality = 0.92;
    let blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", quality),
    );
    while (blob && blob.size > 10 * 1024 * 1024 && quality > 0.2) {
      quality -= 0.1;
      blob = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/jpeg", quality),
      );
    }
    if (!blob) return;
    const croppedFile = new File(
      [blob],
      file.name.replace(/\.[^.]+$/, ".jpg"),
      {
        type: "image/jpeg",
      },
    );
    onComplete(croppedFile);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Crop Image</ModalHeader>
        <ModalBody>
          {imgUrl && (
            <Box position="relative" ref={containerRef} userSelect="none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgUrl}
                alt="to crop"
                ref={imgRef}
                style={{ maxWidth: "100%", height: "auto" }}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
              />
              <Box
                position="absolute"
                top={`${cropPos.y}px`}
                left={`${cropPos.x}px`}
                width={`${cropSize}px`}
                height={`${cropSize}px`}
                border="2px dashed #fff"
                cursor="move"
                onMouseDown={onMouseDown}
              />
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose} variant="ghost">
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleCrop}>
            Crop
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
