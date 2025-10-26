
function NavLink({isActive, name, whenClicked}) {
    return (
        <>
            {!isActive && (
                <button className="text-4xl font-inria text-[#5A311F]"
                onClick={whenClicked}>
                    {name}
                </button>
            )}

            {isActive && (
                <button className="text-4xl font-inria text-[#5A311F] underline"
                onClick={whenClicked}>
                    {name}
                </button>
            )}
        </>
    )
}

export default NavLink