
function StreakDay({day, wasActive}) {
    return (
        <div className="flex justify-center flex-col h-full w-1/6 rounded-3xl gap-0 z-10">
            <h1 className="text-center">{day}</h1>
            {wasActive && ( 
                // {/* TODO: This isn't the right green color */}
                <div className="border-4 border-[#9cc78b]  rounded-full bg-[#BDECAA] h-[100px] w-[100px] m-auto text-2xl text-center"> 
                    {/* <h1 className="my-auto">✅</h1> */}
                </div>  
            )}

            {!wasActive && ( 
                // {/* TODO: This isn't the right green color */}
                <div className="border-4 border-[#2F4858] border-dashed bg-[#FAFAF0] rounded-full h-[100px] w-[100px] m-auto text-2xl text-center">     
                </div>  
            )}
        </div>  
    )
}

export default StreakDay