export default function Header({ left_side, right_side }) {
  return (
    <header
      className="sticky top-0 z-40 w-full 
                 bg-[#FAFAF0]/85 backdrop-blur
                 border-b border-[#2F4858]/15
                 px-5 md:px-8"
      role="banner"
    >
      <div className="h-20 md:h-14 flex items-center justify-between">
        {left_side}
        {right_side}
      </div>
    </header>
  );
}
