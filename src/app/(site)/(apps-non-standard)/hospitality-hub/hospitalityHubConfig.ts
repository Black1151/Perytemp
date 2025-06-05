export interface HospitalityItem {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  image?: string;
  [key: string]: any;
}

export interface HospitalityCategory {
  key: string;
  title: string;
  image: string;
  optionalFields: string[];
}

export const hospitalityHubConfig: HospitalityCategory[] = [
  {
    key: "hotels",
    title: "Hotels",
    image: "/big-up/big-up-app-bg.webp",
    optionalFields: ["location", "rating"],
  },
  {
    key: "rewards",
    title: "Rewards",
    image: "/carousel/enps-carousel-bg.webp",
    optionalFields: ["points", "expiryDate"],
  },
  {
    key: "events",
    title: "Events",
    image: "/carousel/happiness-score-carousel-bg.webp",
    optionalFields: ["date", "location"],
  },
  {
    key: "medical",
    title: "Medical",
    image: "/carousel/business-score-carousel-bg.webp",
    optionalFields: ["speciality", "location", "contact"],
  },
  {
    key: "legal",
    title: "Legal",
    image: "/carousel/client-satisfaction-bg.webp",
    optionalFields: ["speciality", "location", "contact"],
  },
];

export default hospitalityHubConfig;
