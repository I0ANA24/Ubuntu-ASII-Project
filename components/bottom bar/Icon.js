import Image from "next/image";
import React from "react";

const Icon = ({ src }) => {
  return (
    <div className="h-full aspect-square relative text-white hover:bg-white/20 rounded-sm hover:cursor-pointer">
      <Image src={src} fill alt="App_Icon" className="p-1 object-cover" />
    </div>
  );
};

export default Icon;
