import Header from "./../components/Header.jsx";
import Logo from "./../components/Logo.jsx";

function ToDo() {

  return (
    <div className="bg-[#FAFAF0] **overflow-hidden**">
        <Header left_side={<Logo></Logo>} right_side="PROFILE   DASHBOARD"></Header>

        {/* Main div for the three sections */}
        <div className="w-full flex">
            <div className="flex-1 p-5 border h-screen">
                left
            </div>

            <div className="flex-none p-5 w-1/2 border h-screen">
                <div className="w-full h-10 flex justify-between items-center">
                    <h1 className="text-3xl">to-do:</h1>
                    <button className="border-4 border-[#2F4858] rounded-lg px-4 text-lg">+ add task</button>
                </div>
            </div>

            <div className="flex-1 p-5 border h-screen">
                right
            </div>
        </div>
    </div>
  )
}

export default ToDo