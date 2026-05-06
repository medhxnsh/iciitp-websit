import Image from "next/image";

interface LogoConfig {
  src: string;
  /** object-fit for the image — use "cover" for banner images cropped to a focal point */
  fit?: "contain" | "cover";
  /** object-position — defaults to "left center" for contain, "right center" for cover */
  pos?: string;
  /** Width multiplier relative to size prop. Defaults to 2.8 for wide logos, 1 for square */
  widthRatio?: number;
}

const LOGOS: Record<string, LogoConfig> = {
  "icitp-incubation": { src: "/images/programs/icitp-incubation.png", fit: "contain", pos: "left center", widthRatio: 1.2 },
  "nidhi-prayas":     { src: "/images/programs/nidhi-prayas.jpg",     fit: "contain", pos: "left center", widthRatio: 3 },
  "nidhi-eir":        { src: "/images/programs/nidhi-eir.png",         fit: "contain", pos: "left center", widthRatio: 3 },
  "sisf":             { src: "/images/programs/sisf.png",              fit: "contain", pos: "center",      widthRatio: 1.1 },
  "genesis":          { src: "/images/programs/genesis.png",           fit: "contain", pos: "left center", widthRatio: 2.5 },
  // Bio-NEST: full 6:1 banner — show the whole image
  "bionest":          { src: "/images/programs/bionest.png",           fit: "contain", pos: "left center",  widthRatio: 6 },
};

export function ProgramLogo({ slug, size = 48 }: { slug: string; size?: number }) {
  const cfg = LOGOS[slug];
  if (!cfg) return null;

  const w = Math.round(size * (cfg.widthRatio ?? 2.8));
  return (
    <div
      style={{
        width: w,
        height: size,
        position: "relative",
        flexShrink: 0,
      }}
    >
      <Image
        src={cfg.src}
        alt=""
        fill
        sizes={`${w}px`}
        style={{
          objectFit: cfg.fit ?? "contain",
          objectPosition: cfg.pos ?? "left center",
        }}
        aria-hidden="true"
      />
    </div>
  );
}
