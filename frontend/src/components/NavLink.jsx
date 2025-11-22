/*
The component used to render a link to navigate to. 

inputs:
isActive - boolean representing whether or not the user is currently
            at this link
name - string of the name for this link to render
whenClicked - function handler for when this link is clicked
*/

export default function NavLink({ isActive, name, whenClicked }) {
  return (
    <button
      onClick={whenClicked}
      className={[
        "relative inline-flex items-center rounded-md px-3 py-2 text-sm md:text-base font-medium font-jua",
        "transition-colors",
        isActive
          ? "text-white bg-[#2F4858]"
          : "text-[#5A311F] hover:text-[#2F4858] hover:bg-[#2F4858]/10"
      ].join(" ")}
      aria-current={isActive ? "page" : undefined}
    >
      {name}
    </button>
  );
}
