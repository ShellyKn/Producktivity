
function StreakDay({day}) {
    return (
        <div className="flex justify-center flex-col h-full w-1/6 rounded-3xl gap-0 z-10">
            <h1 className="text-center">{day}</h1>
            {/* TODO: This isn't the right green color */}
            <div className="border rounded-full bg-green-400 h-[100px] w-[100px] m-auto text-2xl text-center"> 
                {/* <h1 className="my-auto">✅</h1> */}
            </div>
        </div>  
    )
}

export default StreakDay