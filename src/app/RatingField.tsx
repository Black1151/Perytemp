import React, { useState } from "react";
import { Box, HStack, Image } from "@chakra-ui/react";

// Import your SVG or PNG files
import icon1 from "/smiley-icon.svg";
import icon2 from "/smiley-icon.svg";
import icon3 from "/smiley-icon.svg";
import icon4 from "/smiley-icon.svg";
import icon5 from "/smiley-icon.svg";
import icon6 from "/smiley-icon.svg";
import icon7 from "/smiley-icon.svg";
import icon8 from "/smiley-icon.svg";
import icon9 from "/smiley-icon.svg";
import icon10 from "/smiley-icon.svg";

const icons = [
  icon1,
  icon2,
  icon3,
  icon4,
  icon5,
  icon6,
  icon7,
  icon8,
  icon9,
  icon10,
];

const submitScore = (score: number) => {};

interface RatingIconProps {
  index: number;
  selected: boolean;
  onClick: (index: number) => void;
}

const RatingIcon: React.FC<RatingIconProps> = ({
  index,
  selected,
  onClick,
}) => {
  return (
    <Box
      onClick={() => onClick(index)}
      cursor="pointer"
      opacity={selected ? 1 : 0.5}
    >
      <Image src={icons[index]} alt={`icon-${index + 1}`} boxSize="24px" />
    </Box>
  );
};

interface RatingFieldProps {}

export const RatingField: React.FC<RatingFieldProps> = () => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const handleRatingClick = (index: number) => {
    setSelectedRating(index);
    submitScore(index + 1);
  };

  return (
    <HStack spacing={2}>
      {icons.map((_, index) => (
        <RatingIcon
          key={index}
          index={index}
          selected={index <= (selectedRating ?? -1)}
          onClick={handleRatingClick}
        />
      ))}
    </HStack>
  );
};
