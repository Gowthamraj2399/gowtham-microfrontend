import React from "react";
import { redShadowColor } from "../../../constants/constants";

const Testimonials = React.forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      className="relative py-4 bg-white text-black container pt-24"
    >
      <div className="flex justify-end items-end flex-col">
        <p className=" font-Cormorant text-lg font-semibold italic text-primary-red">
          {"<h2>"}
        </p>
        <div className="flex items-center justify-end">
          <h1 className="font-bold text-secondary-blue/20 text-4xl md:text-7xl uppercase">
            TESTIMONIALS
          </h1>
          <h1
            className="text-xl md:text-4xl font-bold text-secondary-blue absolute mr-2"
            style={{ textShadow: `2px 2px ${redShadowColor}` }}
          >
            Testimonials
          </h1>
        </div>

        <p className=" font-Cormorant text-lg font-semibold italic text-primary-red">
          {"</h2>"}
        </p>
      </div>
    </div>
  );
});

export default Testimonials;
