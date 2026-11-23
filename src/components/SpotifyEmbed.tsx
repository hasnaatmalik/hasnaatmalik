import { useEffect, useRef, useState } from "react";
import { profile } from "@/constants/profile";
import { useTheme } from "@/lib/theme";

/** Spotify's player, mounted only once it's near the viewport (it's a heavy iframe). */
export default function SpotifyEmbed() {
  const { theme } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const src = `https://open.spotify.com/embed/playlist/${profile.spotifyPlaylist}?utm_source=generator${theme === "dark" ? "&theme=0" : ""}`;

  return (
    <div ref={ref} className="spotify">
      {visible ? (
        <iframe
          key={theme}
          title="Hasnaat's Spotify playlist"
          src={src}
          width="100%"
          height="352"
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        />
      ) : (
        <div className="spotify-placeholder" />
      )}
    </div>
  );
}
