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

interface ImageCropperProps {
  /** original file selected by the user (may be null while no image picked) */
  file: File | null;
  isOpen: boolean;
  /** called with the new file once the user hits “Crop” */
  onComplete: (file: File) => void;
  /** called when the user cancels / closes the modal */
  onCancel: () => void;
  /**
   * Desired aspect ratio.
   * Leave undefined for free‑form, pass `1` for square avatars, `16/9` for banners, etc.
   */
  aspect?: number;
}

/* ------------------------------------------------------------ */
/* utility: turn a canvas into a File (with optional re‑encode) */
const canvasToFile = async (
  canvas: HTMLCanvasElement,
  origin: File,
  quality = 0.9
): Promise<File> =>
  new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(new File([blob!], origin.name, { type: origin.type })),
      origin.type,
      quality
    );
  });

/* render/crop helper adapted from react‑easy‑crop docs */
const getCroppedFile = async (
  image: HTMLImageElement,
  crop: Area,
  originFile: File
): Promise<File> => {
  const canvas = document.createElement("canvas");
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  // compress if needed to stay <10 MB
  let result = await canvasToFile(canvas, originFile);
  let quality = 0.8;
  while (result.size > 10 * 1024 * 1024 && quality >= 0.1) {
    result = await canvasToFile(canvas, originFile, quality);
    quality -= 0.1;
  }
  return result;
};
/* ------------------------------------------------------------ */

export default function ImageCropper({
  file,
  isOpen,
  onComplete,
  onCancel,
  aspect = 1, // default to square crop
}: ImageCropperProps) {
  /* ------------ local state ------------ */
  const [imgURL, setImgURL] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPx, setCroppedAreaPx] = useState<Area | null>(null);

  const hiddenImgRef = useRef<HTMLImageElement | null>(null); // needed for pixel‑perfect export

  /* refresh preview when a new File object arrives */
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setImgURL(url);
      // housekeeping: revoke URL when modal closes or file changes
      return () => URL.revokeObjectURL(url);
    }
    setImgURL(null);
  }, [file]);

  const handleCropComplete = useCallback(
    (_: Area, pixels: Area) => setCroppedAreaPx(pixels),
    []
  );

  const handleFinish = async () => {
    if (!file || !croppedAreaPx || !hiddenImgRef.current) return;
    const newFile = await getCroppedFile(
      hiddenImgRef.current,
      croppedAreaPx,
      file
    );
    onComplete(newFile);
  };

  /* ------------------------------------- */
  return (
    <Modal isOpen={isOpen} onClose={onCancel} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Crop image</ModalHeader>
        <ModalBody>
          {/* the visual cropper */}
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
            <Flex mt={4} align="center">
              <Box w="full">
                <Slider
                  aria-label="Zoom"
                  step={0.1}
                  min={1}
                  max={3}
                  value={zoom}
                  onChange={(v) => setZoom(v)}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </Box>
            </Flex>
          )}

          {/* hidden image element (never displayed) – just for canvas export */}
          {imgURL && (
            <img
              ref={hiddenImgRef}
              src={imgURL}
              alt=""
              style={{ display: "none" }}
              onLoad={(e) => {
                // force react‑easy‑crop to recalc after actual bitmap loads
                // (prevents rare edge cases with small images)
                setCrop({ x: 0, y: 0 });
              }}
            />
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
