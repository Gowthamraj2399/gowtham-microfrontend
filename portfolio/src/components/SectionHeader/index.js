import React from "react";
import SimpleTransition from "../SimpleTransition";
import {
  blueShadowColor,
  redShadowColor,
  whiteShadowColor,
} from "../../constants/constants";

const SectionHeader = (props) => {
  const primary =
    props.color === "blue" && props.theme === "light"
      ? redShadowColor
      : blueShadowColor;
  const secondary =
    props.color === "red" && props.theme === "light"
      ? blueShadowColor
      : whiteShadowColor;
  return (
    <SimpleTransition width="100%">
      <div
        className={`flex justify-${props.align} items-${props.align} flex-col`}
      >
        <p
          className={`font-Cormorant text-lg font-semibold italic ${
            props.color === "blue" ? "text-primary-red" : "text-secondary-blue"
          } dark:text-white/40`}
        >
          {"<h2>"}
        </p>
        <div className={`flex items-center justify-${props.align}`}>
          <h1
            className={`font-bold ${
              props.color === "blue"
                ? "text-pg-white"
                : "text-secondary-blue/20"
            } text-5xl md:text-7xl uppercase dark:text-white/20`}
          >
            {props.subtitle}
          </h1>
          <h1
            className={`text-2xl md:text-4xl font-bold ${
              props.color === "blue"
                ? "text-secondary-blue"
                : "text-primary-red"
            } absolute ml-3 dark:text-dark-primary`}
            style={{
              textShadow: `2px 2px ${
                props.theme === "light" ? primary : secondary
              }`,
            }}
          >
            {props.title}
          </h1>
        </div>
        <p
          className={`font-Cormorant text-lg font-semibold italic ${
            props.color === "blue" ? "text-primary-red" : "text-secondary-blue"
          } dark:text-white/40`}
        >
          {"</h2>"}
        </p>
      </div>
    </SimpleTransition>
  );
};

export default SectionHeader;

SectionHeader.defaultProps = {
  color: "blue",
  theme: "light",
  align: "start",
};
