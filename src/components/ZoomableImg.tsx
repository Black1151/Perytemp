import { Image } from "@chakra-ui/react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

function ZoomableImg({ src, alt }: { src: string; alt?: string }) {
  return (
    <TransformWrapper
      pinch={{ disabled: false }} // enable pinch-zoom
      panning={{ disabled: false }} // enable drag
      doubleClick={{ disabled: true }} // optional: no dbl-tap zoom
      wheel={{ disabled: false }} // ignore desktop wheel zoom
      limitToBounds={true} // free panning outside bounds
    >
      <TransformComponent
        wrapperStyle={{
          width: "100%",
          height: "100%",
          touchAction: "none", // iOS Safari needs this
        }}
      >
        <Image
          src={src}
          alt={alt}
          maxW="100%"
          width="100%" // ← force image to fill container’s width
          height="auto" // ← let height grow beyond container
          objectFit="contain" // ← preserves aspect ratio
        />
      </TransformComponent>
    </TransformWrapper>
  );
}

export default ZoomableImg;
