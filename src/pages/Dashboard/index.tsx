import { useEffect } from "react";

export default function DashBoard() {
  useEffect(() => {
    document.title = "HR-Management | DashBoard";
  }, []);
  return (
    <div className="bg-[#F7F7F7] md:h-[calc(100vh-129px)] h-auto rounded-xl p-4">
      DashBoard
      <button className="bg-[#0755E9] text-green-fp400 p-3 rounded">
        [#0755E9] Button
      </button>
      <button className="bg-[#F7F7F7] text-black p-3 rounded">
        [#F7F7F7] Button
      </button>
    </div>
  );
}
