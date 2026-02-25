import React from "react";
import { FaArrowDown } from "react-icons/fa";
import {
  blueShadowColor,
  whiteShadowColor,
} from "../../../constants/constants";
import DevLight from "../../../assets/images/developer_light.gif";
import DevDark from "../../../assets/images/developer_dark_bg.gif";
import Reveal from "../../../components/Reveal";

const Hero = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} className="relative min-h-screen flex flex-col pt-24">
      <div className="flex justify-center items-center">
        <p className="absolute left-1 md:left-8 font-Cormorant text-lg font-semibold italic text-pg-white">
          {"<html>"}
        </p>
        <span className="px-3">
          <p className="flex items-center text-sm justify-center uppercase md:after:content-[''] md:after:w-10 md:after:h-0.5 md:after:mx-2.5 md:after:bg-black dark:md:after:bg-dark-white md:before:content-[''] md:before:w-10 md:before:h-0.5 md:before:mx-2.5 md:before:bg-black dark:md:before:bg-dark-white font-Montserrat">
            <span className="text-orange-500 mr-2 dark:text-dark-text">
              BASED
            </span>
            <span className="text-blue-700 mr-2 dark:text-dark-text">
              OUT OF
            </span>
            <span className="text-green-700 dark:text-dark-text">INDIA</span>
          </p>
        </span>
      </div>
      <div className="flex">
        <p className="absolute left-4 md:left-16 font-Cormorant text-lg font-semibold italic text-pg-white">
          {"<body>"}
        </p>
      </div>
      <div className="m-auto">
        <div className="lg:grid grid-cols-2 items-center gap-20 container mt-16">
          <div className="flex-1 mt-16 md:mt-0">
            <Reveal mode={props.theme}>
              <p className=" font-Cormorant text-lg font-semibold italic text-secondary-blue dark:text-white/40">
                {"<h1>"}
              </p>
            </Reveal>
            <Reveal mode={props.theme}>
              <h1 className="text-2xl font-bold my-2">Hi there! This is</h1>
            </Reveal>
            <Reveal mode={props.theme}>
              <h1
                className="text-4xl font-bold text-primary-red my-2 dark:text-dark-primary"
                style={{
                  textShadow: `2px 2px ${
                    props.theme === "light" ? blueShadowColor : whiteShadowColor
                  }`,
                }}
              >
                GOWTHAM RAJ
              </h1>
            </Reveal>
            <Reveal mode={props.theme}>
              <h1 className="text-4xl font-bold my-2">Web/Mobile developer</h1>
            </Reveal>
            <Reveal mode={props.theme}>
              <p className="my-2">and this is my pitch to come work for you</p>
            </Reveal>
            <Reveal mode={props.theme}>
              <p className=" font-Cormorant text-lg font-semibold italic text-secondary-blue dark:text-white/40">
                {"</h1>"}
              </p>
            </Reveal>
            <Reveal mode={props.theme}>
              <button
                className="py-1 px-2 bg-secondary-blue text-white my-8 font-semibold rounded-md flex items-center animate-bounce dark:bg-dark-primary"
                onClick={props.onAboutClick}
              >
                Show More <FaArrowDown className="ml-2" size={16} />
              </button>
            </Reveal>
          </div>
          <div className="flex-1">
            <Reveal mode={props.theme}>
              <img
                src={props.theme === "light" ? DevLight : DevDark}
                alt="Some illustration"
                className="h-[500px] w-[500px] object-contain"
              />
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Hero;
