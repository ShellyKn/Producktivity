function Header({left_side, right_side}) {
  return (
    <div className="w-full h-28 flex justify-between items-center p-4">
        {left_side}
        {right_side}
    </div>
  )
}

export default Header