"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Button,
  Flex,
  Box,
} from "@chakra-ui/react";

/* --------------------------------------------------------------------- */
/* ------------------------------ types -------------------------------- */
interface ImageCropperProps {
  file: File | null;
  isOpen: boolean;
  onComplete: (file: File) => void;
  onCancel: () => void;
  /** crop aspect ratio, default = 1 (square) */
  aspect?: number;
  /** maximum allowed file size in MB (default 10) */
  maxSizeMB?: number;
}
/* --------------------------------------------------------------------- */

/* ---------- canvas helpers ---------- */
const drawImageToCanvas = (
  img: HTMLImageElement,
  crop: Area
): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    img,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );
  return canvas;
};

const canvasToBlob = (
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob> =>
  new Promise((resolve) => canvas.toBlob((b) => resolve(b!), type, quality));

/* compress + resize until ≤ maxBytes */
const canvasToSizedFile = async (
  srcCanvas: HTMLCanvasElement,
  origin: File,
  maxBytes: number
): Promise<File> => {
  let canvas = srcCanvas;
  let quality = 0.9;

  /* helper to encode canvas & return File   */
  const encode = async (): Promise<File> => {
    const blob = await canvasToBlob(canvas, origin.type, quality);
    return new File([blob], origin.name, { type: origin.type });
  };

  let out = await encode();

  /* Step 1: lower JPEG/PNG quality */
  while (out.size > maxBytes && quality > 0.5) {
    quality -= 0.1;
    out = await encode();
  }

  /* Step 2: down‑scale bitmap if still too big */
  while (out.size > maxBytes && (canvas.width > 256 || canvas.height > 256)) {
    const nextCanvas = document.createElement("canvas");
    nextCanvas.width = Math.round(canvas.width * 0.9);
    nextCanvas.height = Math.round(canvas.height * 0.9);
    nextCanvas
      .getContext("2d")!
      .drawImage(canvas, 0, 0, nextCanvas.width, nextCanvas.height);
    canvas = nextCanvas;
    /* reset quality a bit when dimensions drop */
    quality = Math.min(quality + 0.1, 0.9);
    out = await encode();
  }

  return out;
};
/* ------------------------------------ */

export default function ImageCropper({
  file,
  isOpen,
  onComplete,
  onCancel,
  aspect = 1,
  maxSizeMB = 1.95,
}: ImageCropperProps) {
  /* local state */
  const [imgURL, setImgURL] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPx, setCroppedAreaPx] = useState<Area | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);

  /* refresh preview when new file selected */
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setImgURL(url);
      return () => URL.revokeObjectURL(url);
    }
    setImgURL(null);
  }, [file]);

  const handleCropComplete = useCallback(
    (_: Area, pixels: Area) => setCroppedAreaPx(pixels),
    []
  );

  const handleFinish = async () => {
    if (!file || !croppedAreaPx || !imgRef.current) return;

    /* 1 — render selected pixels to canvas */
    const canvas = drawImageToCanvas(imgRef.current, croppedAreaPx);

    /* 2 — compress / resize to threshold */
    const maxBytes = maxSizeMB * 1024 * 1024;
    const sizedFile = await canvasToSizedFile(canvas, file, maxBytes);

    onComplete(sizedFile);
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Crop image</ModalHeader>
        <ModalBody>
          {/* live cropper */}
          {imgURL && (
            <Box position="relative" w="100%" h="400px">
              <Cropper
                image={imgURL}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
                showGrid={false}
              />
            </Box>
          )}

          {/* zoom slider */}
          {imgURL && (
            <Flex mt={4}>
              <Slider
                aria-label="Zoom"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(v) => setZoom(v)}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </Flex>
          )}

          {/* hidden image (never shown) – needed for pixel‑accurate crop */}
          {imgURL && (
            <img ref={imgRef} src={imgURL} style={{ display: "none" }} alt="" />
          )}
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onCancel}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleFinish} isDisabled={!file}>
            Crop
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
