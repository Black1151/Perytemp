import { HospitalityCategory } from "@/types/hospitalityHub";

export const hospitalityHubCategories: HospitalityCategory[] = [
  {
    key: "hotels",
    displayName: "Hotels",
    image: "/big-up/big-up-app-bg.webp",
    optionalFields: ["location"],
  },
  {
    key: "rewards",
    displayName: "Rewards",
    image: "/carousel/enps-carousel-bg.webp",
    optionalFields: [],
  },
  {
    key: "events",
    displayName: "Events",
    image: "/carousel/happiness-score-carousel-bg.webp",
    optionalFields: ["location", "date"],
  },
  {
    key: "medical",
    displayName: "Medical",
    image: "/carousel/business-score-carousel-bg.webp",
    optionalFields: ["location"],
  },
  {
    key: "legal",
    displayName: "Legal",
    image: "/carousel/client-satisfaction-bg.webp",
    optionalFields: ["location"],
  },
];

export default hospitalityHubCategories;
