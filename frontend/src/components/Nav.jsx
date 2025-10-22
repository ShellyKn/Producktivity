import NavLink from "./NavLink";


function Nav({pages, setIndex, index}) {
    const handleClick = (index) => {
        setIndex(index);
    }

    return (
        <div className="flex justify-between items-center gap-8">
            {pages &&
                // TODO: Needs a key for good practice
                pages.map((page, i) => { 
                        return (
                            <NavLink whenClicked={() => handleClick(i)} name={pages[i]} isActive={index == i}></NavLink>
                        )
                    }
                )
            }
        </div>  
    )
}

export default Nav