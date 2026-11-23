import { asset } from "@/lib/asset";

export interface GalleryPhoto {
  src: string; // file in public/gallery
  width: number;
  height: number;
  alt: string;
}

// To add photos: drop the file in public/gallery and add a line here.
// It's one collection, not categories. The order is the order on the page, so mix it up:
// mountains, trails and the city sit side by side on purpose.
const photos: GalleryPhoto[] = [
  {
    src: "/gallery/purple-peaks-dusk.jpg",
    width: 1600,
    height: 1200,
    alt: "Jagged snow-dusted peaks above a braided river at dusk",
  },
  {
    src: "/gallery/city-night.jpg",
    width: 1066,
    height: 1600,
    alt: "City towers and rooftops at night under a crescent moon",
  },
  {
    src: "/gallery/forest-light-rays.jpg",
    width: 1200,
    height: 1600,
    alt: "Sunbeams through a pine forest with a lone figure on the path",
  },
  {
    src: "/gallery/grazing-horses.jpg",
    width: 1200,
    height: 1600,
    alt: "Horses grazing in a meadow below a pine-covered hill and storm clouds",
  },
  {
    src: "/gallery/rickshaw-bougainvillea.jpg",
    width: 1200,
    height: 1600,
    alt: "A green rickshaw in front of a bougainvillea-covered wall",
  },
  {
    src: "/gallery/night-stream.jpg",
    width: 1200,
    height: 1600,
    alt: "A long-exposure mountain stream at night under low cloud",
  },
  {
    src: "/gallery/riverside-tent.jpg",
    width: 1200,
    height: 1600,
    alt: "A tent beside a fast river on a grassy, overcast plain",
  },
  {
    src: "/gallery/rock-ridge.jpg",
    width: 1200,
    height: 1600,
    alt: "Hikers on a rocky ridge above a mountain valley",
  },
  {
    src: "/gallery/dusk-hills.jpg",
    width: 1600,
    height: 1066,
    alt: "Layered hills at dusk with a pink sky and a pine silhouette",
  },
  {
    src: "/gallery/village-lane.jpg",
    width: 1200,
    height: 1600,
    alt: "A dirt lane curving between orchard trees",
  },
  {
    src: "/gallery/yurts-mountains.jpg",
    width: 1200,
    height: 1600,
    alt: "Teal-roofed yurts below cloud-covered mountains",
  },
  {
    src: "/gallery/night-tables.jpg",
    width: 1200,
    height: 1600,
    alt: "Empty picnic tables under street lamps in the fog",
  },
  {
    src: "/gallery/forest-trail-sunset.jpg",
    width: 1200,
    height: 1600,
    alt: "A rocky trail through tall pines at sunset",
  },
  {
    src: "/gallery/valley-jeeps.jpg",
    width: 1200,
    height: 1600,
    alt: "Jeeps and a motorbike parked in a valley beneath steep, sunlit ridges",
  },
  {
    src: "/gallery/sunset-through-tree.jpg",
    width: 1200,
    height: 1600,
    alt: "Low sun and lens flare through a tree beside a telecom cabinet",
  },
  {
    src: "/gallery/riverbed-mountains.jpg",
    width: 1200,
    height: 1600,
    alt: "A wooden plank across a dry riverbed with mountains behind",
  },
  {
    src: "/gallery/bus-streetlight.jpg",
    width: 852,
    height: 1136,
    alt: "A streetlamp glowing through tree silhouettes above a campus bus at dusk",
  },
  {
    src: "/gallery/red-huts-valley.jpg",
    width: 1200,
    height: 1600,
    alt: "Red huts below a pine-covered hillside in golden light",
  },
  {
    src: "/gallery/night-cars-red.jpg",
    width: 1200,
    height: 1600,
    alt: "Cars and people lit red on a hilltop at night",
  },
];

export const galleryPhotos: GalleryPhoto[] = photos.map((photo) => ({
  ...photo,
  src: asset(photo.src),
}));
