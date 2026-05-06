import Image from "next/image";

export const LAB_PHOTOS: Record<string, [string, string]> = {
  "clean-room":     ["/images/labs/cleanroom1.jpg",  "/images/labs/cleanroom2.jpg"],
  "design-sim":     ["/images/labs/design-sim1.jpg", "/images/labs/design-sim2.jpg"],
  "esdm":           ["/images/labs/esdm1.jpg",       "/images/labs/esdm2.jpg"],
  "mech-packaging": ["/images/labs/mech-pack1.jpg",  "/images/labs/mech-pack2.jpg"],
  "pcb-fab":        ["/images/labs/pcb-fab1.jpg",    "/images/labs/pcb-fab2.jpg"],
  "test-cal":       ["/images/labs/test-cal1.jpg",   "/images/labs/test-cal2.jpg"],
};

interface LabPhotoGalleryProps {
  slug: string;
  labTitle: string;
}

export function LabPhotoGallery({ slug, labTitle }: LabPhotoGalleryProps) {
  const photos = LAB_PHOTOS[slug];
  if (!photos) return null;

  return (
    <div className="grid grid-cols-2 gap-3 mb-10">
      {photos.map((src, i) => (
        <div
          key={i}
          className="relative rounded-xl overflow-hidden"
          style={{ aspectRatio: "4/3" }}
        >
          <Image
            src={src}
            alt={`${labTitle} — view ${i + 1}`}
            fill
            className="object-cover"
            quality={88}
            sizes="(max-width: 768px) 50vw, 40vw"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 50%)" }}
          />
        </div>
      ))}
    </div>
  );
}
