"use client";

import { FC } from "react";
import Confetti from "@/components/animations/confetti/Confetti";

interface ConfettiWrapperProps {
  show: boolean;
}

export const ConfettiWrapper: FC<ConfettiWrapperProps> = ({ show }) => {
  if (!show) return null;
  return <Confetti show={show} />;
};
