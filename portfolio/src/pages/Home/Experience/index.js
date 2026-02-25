import React from "react";
import ABG from "../../../assets/images/ABG.png";
import CGVAK from "../../../assets/images/CGVAK.webp";
import TechConative from "../../../assets/images/techconative.png";
import SymphonyAI from "../../../assets/images/symphony.png";
import dayjs from "dayjs";
import SimpleTransition from "../../../components/SimpleTransition";
import SectionHeader from "../../../components/SectionHeader";

const Experience = React.forwardRef((props, ref) => {
  const myExperiences = [
    {
      companyName: "SymphonyAI",
      role: "Software Engineer",
      startDate: "2025-02-28",
      isCurrent: true,
      endDate: null,
      skills: ["Microfrontend", "ReactJs", "Webpack"],
      img: SymphonyAI,
    },
    {
      companyName: "TechConative",
      role: "Software Engineer",
      startDate: "2024-03-01",
      isCurrent: false,
      endDate: "2025-02-27",
      skills: ["NextJS", "ReactJs", "Figma", "Material UI", "RxJS"],
      img: TechConative,
    },
    {
      companyName: "Group Data & Analytics, Aditya Birla Group",
      role: "Associate Product Engineer",
      startDate: "2022-11-14",
      isCurrent: false,
      endDate: "2024-02-09",
      skills: ["React", "Fabric Js", "Figma", "Material UI", "SQL"],
      img: ABG,
    },
    {
      companyName: "CG-VAK Software & Exports Ltd",
      role: "Software Engineer",
      startDate: "2020-09-25",
      isCurrent: false,
      endDate: "2022-11-09",
      skills: [
        "React",
        "React Native",
        "Angular",
        "Ionic",
        "Tailwind css",
        "Firebase",
      ],
      img: CGVAK,
    },
  ];

  const convertDateFormat = (startDate, endDate) => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const months = end.diff(start, "month", true);
    const roundedMonths = Math.ceil(months); // Changed to Math.ceil to round up
    const years = Math.floor(roundedMonths / 12);
    const remainingMonths = roundedMonths % 12;

    if (years < 1) {
      return `${remainingMonths} mos`;
    } else if (remainingMonths <= 0) {
      return `${years} yrs`;
    } else {
      return `${years} yrs ${remainingMonths} mos`;
    }
  };

  return (
    <div ref={ref} className="relative container mb-8">
      <SectionHeader
        title="My Experiences"
        subtitle="Experiences"
        theme={props.theme}
        color="red"
      />

      <div className="flex flex-col gap-4 my-8 flex-1 relative">
        <div className="w-1 bg-secondary-blue/20 dark:bg-white/20 h-full absolute lg:left-1/2"></div>

        {myExperiences.map((experience, index) => {
          return (
            <SimpleTransition width="100%">
              <div
                className={`ml-12 
                    lg:ml-0
                    dark:bg-white/80 
                    relative 
                    border-dashed 
                    border-2 
                    rounded-md 
                    p-4 flex 
                    gap-4 
                    lg:w-2/5
                    ${
                      index % 2 === 0
                        ? `before:content-[' '] before:z-10 before:absolute before:p-2 before:rounded-full before:bg-primary-blue dark:before:bg-dark-primary before:-left-[56px] before:top-[49%] before:-translate-y-1/2 
                    after:content-[' '] after:absolute after:w-12 after:h-2 after:border-t-2 after:border-dashed after:-left-12 after:top-1/2 after:-translate-y-1/2 
                    lg:before:left-auto
                    lg:after:left-auto
                    lg:before:content-[' '] lg:before:z-10 lg:before:absolute lg:before:p-2 lg:before:rounded-full lg:before:bg-primary-blue dark:lg:before:bg-dark-primary lg:before:-right-[122px] lg:before:top-[49%] lg:before:-translate-y-1/2 
                    lg:after:content-[' '] lg:after:absolute lg:after:w-28 lg:after:h-2 lg:after:border-t-2 lg:after:border-dashed lg:after:-right-28 lg:after:top-1/2 lg:after:-translate-y-1/2`
                        : `lg:ml-auto before:content-[' '] before:z-10 before:absolute before:p-2 before:rounded-full before:bg-primary-blue dark:before:bg-dark-primary before:-left-[56px] before:top-[49%] before:-translate-y-1/2 
                  after:content-[' '] after:absolute after:w-12 after:h-2 after:border-t-2 after:border-dashed after:-left-12 after:top-1/2 after:-translate-y-1/2 
                  lg:before:content-[' '] lg:before:z-10 lg:before:absolute lg:before:p-2 lg:before:rounded-full lg:before:bg-primary-blue dark:lg:before:bg-dark-primary lg:before:-left-[118px] lg:before:top-[49%] lg:before:-translate-y-1/2 
                  lg:after:content-[' '] lg:after:absolute lg:after:w-28 lg:after:h-2 lg:after:border-t-2 lg:after:border-dashed lg:after:-left-28 lg:after:top-1/2 lg:after:-translate-y-1/2`
                    }
                    `}
              >
                <img
                  src={experience.img}
                  alt="ABG "
                  className="h-12 w-20 lg:w-28 lg:h-20 object-contain"
                />
                <div className="flex flex-col gap-1">
                  <p className="text-md lg:text-lg font-bold text-primary-red">
                    {experience.companyName}
                  </p>
                  <p className="text-sm lg:text-md font-semibold text-primary-blue">
                    {experience.role}
                  </p>
                  <p className="text-xs text-gray-500">
                    {dayjs(experience.startDate).format("MMM YYYY")} -{" "}
                    {experience.isCurrent
                      ? `Present ( ${convertDateFormat(
                          experience.startDate,
                          dayjs()
                        )} )`
                      : `${dayjs(experience.endDate).format(
                          "MMM YYYY"
                        )} ( ${convertDateFormat(
                          experience.startDate,
                          experience.endDate
                        )} )`}
                  </p>

                  <div>
                    <p className="text-xs text-black font-semibold">
                      Skills:&nbsp;
                      {experience.skills.map((skill, index) => {
                        return (
                          <span
                            key={index}
                            className="text-xs text-gray-500 capitalize"
                          >
                            {skill}
                            {index + 1 !== experience.skills.length && " . "}
                          </span>
                        );
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </SimpleTransition>
          );
        })}
      </div>
    </div>
  );
});

export default Experience;
