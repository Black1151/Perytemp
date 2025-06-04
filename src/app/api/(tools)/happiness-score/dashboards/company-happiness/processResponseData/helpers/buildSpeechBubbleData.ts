// helpers/buildSpeechBubbleData.ts
import {
  DataPoint,
  SpeechBubbleData,
} from "@/app/api/(tools)/happiness-score/dashboards/company-happiness/types";

export function buildSpeechBubbleData(
  dataPointsArray: DataPoint[]
): SpeechBubbleData {
  // Default
  let speechBubbleData: SpeechBubbleData = {
    currentScore: 0,
    change: 0,
    positiveChange: true,
  };

  if (dataPointsArray.length >= 2) {
    const currentWeek = dataPointsArray[dataPointsArray.length - 1];
    const previousWeek = dataPointsArray[dataPointsArray.length - 2];
    const change = currentWeek.value - previousWeek.value;

    speechBubbleData = {
      currentScore: currentWeek.value,
      change: Math.abs(change),
      positiveChange: change >= 0,
    };
  } else if (dataPointsArray.length === 1) {
    speechBubbleData = {
      currentScore: dataPointsArray[0].value,
      change: 0,
      positiveChange: true,
    };
  }

  return speechBubbleData;
}
