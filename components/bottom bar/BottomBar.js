import React from "react";
import Icon from "./Icon";

const BottomBar = () => {
  return (
    <footer className="w-full h-11 absolute bottom-0 left-0 bg-black/70 flex justify-center items-center p-1 space-x-1.5">
      <Icon src="/icons/text.png" />
      <Icon src="/icons/files.png" />
      <Icon src="/icons/notepad.png" />
      <Icon src="/icons/etch-a-sketch.png" />
      <Icon src="/icons/tic-tac-toe.png" />
      <Icon src="/icons/calculator.png" />
      <div className="bg-gray-500 h-6.5 w-[1px]"></div>
      <Icon src="/icons/settings.png" />
      <Icon src="/icons/show-apps.png" />
    </footer>
  );
};

export default BottomBar;
