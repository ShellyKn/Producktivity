import { useEffect, useState } from "react";

export default function FollowBar() {
  const [user, setUser] = useState("");
  
  return (
    // Main border 
    <div
      className="border-4 border-[#2F4858] rounded-2xl p-4"
    >
      <h1 className="text-[32px] leading-none">add friends</h1>
      <div className="rounded-xl border border-[#2F4858]/20 bg-[#FAFAF0] px-3 py-2 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <input 
            className="w-full bg-[#FAFAF0] p-2"
            value={user} 
            onChange={(e)=>setUser(e.target.value)} 
            placeholder="Enter user name..." 
          />

          <button
            className="border-4 border-[#2F4858] rounded-xl px-4 py-1.5 text-[20px]
            hover:bg-[#2F4858] hover:text-white transition-colors"
          >
            Follow
          </button>
        </div>
      </div>
    </div>
  );
}