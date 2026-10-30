import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fideresto",
    short_name: "Fideresto",
    description: "El espacio de tus clientes habituales.",
    start_url: "/app",
    display: "standalone",
    lang: "es",
    background_color: "#f4f7fc",
    theme_color: "#315fe7",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
