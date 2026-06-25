import React from "react";
import { FaTrophy } from "react-icons/fa";
import SimpleTransition from "../../../components/SimpleTransition";
import SectionHeader from "../../../components/SectionHeader";

const awards = [
  {
    title: "GDNA Genius Award",
    awarder: "GDNA – Aditya Birla Group",
    year: "2023",
    description:
      "Awarded for designing an innovative canvas-based image annotation solution that significantly improved backend image-processing workflows and team productivity.",
  },
];

const Awards = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} className="relative container mb-8">
      <SectionHeader
        title="Awards"
        subtitle="Awards"
        theme={props.theme}
        color="blue"
      />

      <div className="flex flex-col gap-6 my-8">
        {awards.map((award) => (
          <SimpleTransition key={award.title} width="100%">
            <div className="flex items-start gap-6 border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm dark:bg-white/5 bg-white">
              <div className="flex-shrink-0 p-4 rounded-full bg-yellow-100 dark:bg-yellow-400/20">
                <FaTrophy size={28} className="text-yellow-500" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-primary-red dark:text-dark-primary">
                  {award.title}
                </h3>
                <p className="text-sm font-semibold text-primary-blue dark:text-dark-text">
                  {award.awarder}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {award.year}
                </p>
                <p className="text-sm text-gray-700 dark:text-dark-text/80">
                  {award.description}
                </p>
              </div>
            </div>
          </SimpleTransition>
        ))}
      </div>
    </div>
  );
});

export default Awards;
