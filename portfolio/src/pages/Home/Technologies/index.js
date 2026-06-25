import React from "react";
import { motion } from "framer-motion";
import { FaCode, FaReact, FaServer, FaDatabase, FaCloud, FaCubes, FaBrain } from "react-icons/fa";
import SectionHeader from "../../../components/SectionHeader";
import SimpleTransition from "../../../components/SimpleTransition";

const skillCategories = [
  {
    label: "Programming Languages",
    icon: <FaCode size={30} className="text-primary-blue my-2" />,
    accent: "border-b-primary-blue",
    skills: ["Java", "JavaScript", "TypeScript"],
  },
  {
    label: "Frontend",
    icon: <FaReact size={30} className="text-primary-red my-2" />,
    accent: "border-b-primary-red",
    skills: ["React", "Angular", "React Native", "Redux Toolkit", "React Query", "Material UI", "Tailwind CSS"],
  },
  {
    label: "Backend",
    icon: <FaServer size={30} className="text-secondary-blue my-2" />,
    accent: "border-b-secondary-blue",
    skills: ["Spring Boot", "Microservices", "REST APIs", "JPA / Hibernate"],
  },
  {
    label: "Databases",
    icon: <FaDatabase size={30} className="text-primary-blue my-2" />,
    accent: "border-b-primary-blue",
    skills: ["MySQL", "PostgreSQL", "MongoDB", "Redis"],
  },
  {
    label: "Cloud & DevOps",
    icon: <FaCloud size={30} className="text-primary-red my-2" />,
    accent: "border-b-primary-red",
    skills: ["Docker", "Kubernetes", "AWS", "Git", "GitHub Actions", "Maven", "Gradle"],
  },
  {
    label: "Architecture",
    icon: <FaCubes size={30} className="text-secondary-blue my-2" />,
    accent: "border-b-secondary-blue",
    skills: ["Micro Frontends", "Webpack Module Federation", "Rollup", "Distributed Systems"],
  },
  {
    label: "AI & LLM",
    icon: <FaBrain size={30} className="text-dark-primary my-2" />,
    accent: "border-b-dark-primary",
    skills: ["OpenAI API", "Prompt Engineering", "LangGraph", "LlamaIndex", "MCP", "LangSmith", "LangFuse"],
  },
];

const Technologies = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} className="relative container mb-8">
      <SectionHeader
        title="My Skills"
        subtitle="Skills"
        theme={props.theme}
        color="blue"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 my-8">
        {skillCategories.map((category, index) => (
          <motion.div
            key={category.label}
            className={`h-full flex flex-col${index === skillCategories.length - 1 ? " lg:col-start-2" : ""}`}
            initial={{ opacity: 0, y: 75 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 + (index % 3) * 0.1 }}
          >
            <div
              className={`shadow-md rounded-md border-b-4 ${category.accent} transition-all scale-95 hover:scale-100 dark:bg-white/80 p-4 h-full flex flex-col`}
            >
              <div className="flex flex-col items-center text-center mb-3">
                {category.icon}
                <h3 className="text-sm font-bold dark:text-dark-black">{category.label}</h3>
              </div>
              <div className="flex flex-wrap justify-center gap-1.5 flex-1 content-start">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-medium px-2 py-0.5 rounded bg-secondary-blue/10 text-secondary-blue dark:bg-primary-blue/10 dark:text-primary-blue"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

export default Technologies;
