import React from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const MobileToggleSwitch = (props) => {
  return (
    <div className="bg-dark-black dark:bg-dark-white py-2 px-3 inline-flex gap-4 rounded-md items-center z-20 lg:hidden m-4">
      <div
        className="hidden dark:block cursor-pointer"
        onClick={props.onThemeToggleClick}
      >
        <MdLightMode size={24} className="text-yellow-400" />
      </div>
      <div className="dark:hidden">
        <div className="p-3 rounded-full bg-dark-white"></div>
      </div>
      <div
        className="dark:hidden cursor-pointer"
        onClick={props.onThemeToggleClick}
      >
        <MdDarkMode size={24} className="text-yellow-400" />
      </div>
      <div className="hidden dark:block">
        <div className="p-3 rounded-full bg-dark-black"></div>
      </div>
    </div>
  );
};

export default MobileToggleSwitch;
