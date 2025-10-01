function NavBar({left_side, right_side}) {
  return (
    <div className="w-full h-28 flex justify-between items-center h-screen p-4 border">
        {left_side}
        {right_side}
    </div>
  )
}

export default NavBar