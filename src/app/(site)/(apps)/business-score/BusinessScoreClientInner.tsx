"use client";

import { useEffect, useState } from "react";
import { Tool } from "@/types/types";
import BusinessScoreSplashScreen from "./BusinessScoreSplashScreenOld";

interface HappinessScoreClientInnerProps {
  toolData: Tool;
}

export default function BusinessScoreClientInner({}: HappinessScoreClientInnerProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 6000);
  }, []);

  return <>{isLoading ? <BusinessScoreSplashScreen /> : <></>}</>;
}
