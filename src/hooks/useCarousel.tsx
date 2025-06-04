import { useState } from "react";

const useCarousel = (
  itemsCount: number,
  setParentIndex?: (index: number) => void,
) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const updateIndex = (index: number) => {
    setCurrentIndex(index);
    if (setParentIndex) {
      setParentIndex(index);
    }
  };

  const prevSlide = () => {
    updateIndex(currentIndex === 0 ? itemsCount - 1 : currentIndex - 1);
  };

  const nextSlide = () => {
    updateIndex(currentIndex === itemsCount - 1 ? 0 : currentIndex + 1);
  };

  return { currentIndex, prevSlide, nextSlide, updateIndex };
};

export default useCarousel;
