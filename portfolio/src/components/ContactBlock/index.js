import React from "react";
import SimpleTransition from "../SimpleTransition";

const ContactBlock = (props) => {
  return (
    <SimpleTransition width="100%">
      <div
        className="flex flex-col justify-center items-center scale-95 transition-all hover:scale-100 cursor-pointer my-4"
        onClick={props.onClick}
      >
        <div className="text-primary-blue border-2 border-primary-blue mb-2 p-4 dark:text-dark-primary dark:border-dark-primary">
          {props.icon}
        </div>
        <p>{props.name}</p>
      </div>
    </SimpleTransition>
  );
};

export default ContactBlock;
