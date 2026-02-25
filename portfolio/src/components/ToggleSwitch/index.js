import React from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { motion } from "framer-motion";

const ToggleSwitch = (props) => {
  return (
    <motion.div
      className="hidden bg-dark-black dark:bg-dark-white fixed top-[12%] right-1 py-1 px-2 lg:flex flex-col gap-4 rounded-lg items-center  z-20"
      transition={{
        type: "spring",
        stiffness: 700,
        damping: 30,
      }}
    >
      <div
        className="hidden dark:block cursor-pointer mt-1"
        onClick={props.onThemeToggleClick}
      >
        <MdLightMode size={24} className="text-yellow-400" />
      </div>
      <div className="dark:hidden mt-1">
        <div className="p-3 rounded-full bg-dark-white"></div>
      </div>
      <div
        className="dark:hidden cursor-pointer mb-1"
        onClick={props.onThemeToggleClick}
      >
        <MdDarkMode size={24} className="text-yellow-400" />
      </div>
      <div className="hidden dark:block mb-1">
        <div className="p-3 rounded-full bg-dark-black"></div>
      </div>
    </motion.div>
  );
};

export default ToggleSwitch;
