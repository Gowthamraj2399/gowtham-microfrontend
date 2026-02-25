import React from "react";
import SimpleTransition from "../SimpleTransition";

const TechCard = (props) => {
  return (
    <SimpleTransition width="100%">
      <div
        className={`shadow-md my-4 mx-8 md:mx-16 border-b-8 rounded-md border-b-${props.color} cursor-pointer transition-all scale-95 hover:scale-100 hover:shadow-${props.color} dark:bg-white/80 ${props.css}`}
      >
        <div className="p-4 flex justify-center flex-col items-center">
          {props.icon}
          <h3 className="text-xl font-bold my-2 dark:text-dark-black">
            {props.name}
          </h3>
        </div>
      </div>
    </SimpleTransition>
  );
};

export default TechCard;

TechCard.defaultProps = {
  color: "red-500",
};
