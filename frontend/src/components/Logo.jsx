import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="inline-flex items-center gap-2 group">
      {/* tiny duck emoji badge */}
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#2F4858]/10 text-lg">
        🦆
      </span>
      <span className="font-jua tracking-wide text-[#5A311F] text-2xl md:text-3xl leading-none group-hover:opacity-90">
        PRODUCKTIVITY
      </span>
    </Link>
  );
}
