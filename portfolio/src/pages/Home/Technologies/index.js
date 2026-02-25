import React from "react";
import { FaReact, FaAngular } from "react-icons/fa";
import { SiTailwindcss, SiIonic, SiFirebase } from "react-icons/si";
import SectionHeader from "../../../components/SectionHeader";
import TechCard from "../../../components/TechCard";

const Technologies = React.forwardRef((props, ref) => {
  const technologiesList = [
    {
      name: "React",
      icon: <FaReact size={40} className="text-blue-700 my-2" />,
      color: "blue-500",
      css: "border-b-blue-500 hover:shadow-blue-500",
    },
    {
      name: "Angular",
      icon: <FaAngular size={40} className="text-red-500 my-2" />,
      color: "red-500",
      css: "border-b-red-500 hover:shadow-red-500",
    },
    {
      name: "React Native",
      icon: <FaReact size={40} className="text-blue-700 my-2" />,
      color: "blue-500",
      css: "border-b-blue-500 hover:shadow-blue-500",
    },
    {
      name: "Ionic",
      icon: <SiIonic size={40} className="text-black/80 my-2" />,
      color: "black/80",
      css: "border-b-black/80 hover:shadow-black/80",
    },
    {
      name: "Tailwind CSS",
      icon: <SiTailwindcss size={40} className="my-2 text-blue-400" />,
      color: "blue-400",
      css: "border-b-blue-400 hover:shadow-blue-400",
    },
    {
      name: "Firebase",
      icon: <SiFirebase size={40} className="my-2 text-orange-400" />,
      color: "orange-400",
      css: "border-b-orange-400 hover:shadow-orange-400",
    },
  ];

  return (
    <div ref={ref} className="relative container mb-8">
      <SectionHeader
        title="My Skills"
        subtitle="Skills"
        theme={props.theme}
        color="blue"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {technologiesList.map((tech) => (
          <TechCard
            name={tech.name}
            icon={tech.icon}
            color={tech.color}
            css={tech.css}
          />
        ))}
      </div>
    </div>
  );
});

export default Technologies;
