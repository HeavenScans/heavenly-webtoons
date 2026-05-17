import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Retour en haut"
      className={`fixed bottom-5 right-5 z-40 grid h-11 w-11 place-items-center rounded-full bg-[image:var(--gradient-neon)] text-white shadow-[var(--shadow-neon)] transition-all ${
        visible ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-3"
      }`}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
