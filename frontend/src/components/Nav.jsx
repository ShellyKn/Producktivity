import { useState } from "react";
import NavLink from "./NavLink";

/*
The navigation component renders navigation links for the application.

inputs:
pages - a string array of the names for each page
setIndex - function handler to change the current page index
index - an integer of the current page index
*/

export default function Nav({ pages, setIndex, index }) {
  const [open, setOpen] = useState(false);

  function handleClick(i) {
    setIndex(i);
    setOpen(false);
  }

  function handleLogout() {
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  return (
    <nav className="relative" aria-label="Primary">
      {/* Desktop */}
      <div className="hidden md:flex items-center gap-2">
        {pages?.map((page, i) => (
          <NavLink
            key={page}
            name={page}
            isActive={index === i}
            whenClicked={() => handleClick(i)}
          />
        ))}
        <button
          onClick={handleLogout}
          className="font-jua ml-2 inline-flex items-center rounded-md border border-[#2F4858]/20
                     bg-white px-3 py-2 text-sm font-medium text-[#2F4858]
                     hover:bg-[#2F4858] hover:text-white transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Mobile: hamburger */}
      <div className="md:hidden flex items-center gap-2">
        <button
          onClick={() => setOpen(o => !o)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#2F4858]/20
                     text-[#2F4858] hover:bg-[#2F4858] hover:text-white transition-colors"
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <rect x="4" y="7" width="16" height="2" rx="1" />
            <rect x="4" y="11" width="16" height="2" rx="1" />
            <rect x="4" y="15" width="16" height="2" rx="1" />
          </svg>
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-44 rounded-lg border border-[#2F4858]/15 bg-white shadow-lg p-2 md:hidden"
          role="menu"
        >
          <div className="flex flex-col gap-1">
            {pages?.map((page, i) => (
              <button
                key={page}
                onClick={() => handleClick(i)}
                className={[
                  "w-full text-left rounded-md px-3 py-2 text-sm",
                  index === i
                    ? "bg-[#2F4858] text-white"
                    : "text-[#5A311F] hover:bg-[#2F4858]/10 hover:text-[#2F4858]"
                ].join(" ")}
                role="menuitem"
              >
                {page}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="mt-1 w-full text-left rounded-md px-3 py-2 text-sm
                         text-[#2F4858] border border-[#2F4858]/20
                         hover:bg-[#2F4858] hover:text-white transition-colors"
              role="menuitem"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
