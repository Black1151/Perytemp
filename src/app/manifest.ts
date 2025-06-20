import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Perygon - Your Business Growth Toolkit",
    short_name: "Perygon",
    description: "Perygon - Your Business Growth Toolkit",
    start_url: "/login",
    display: "standalone",
    background_color: "#1E283A",
    theme_color: "#1E283A",
    icons: [
      {
        src: "/images/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
