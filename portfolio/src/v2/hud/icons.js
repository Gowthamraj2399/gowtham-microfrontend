import React from "react";
import {
  FaCode,
  FaReact,
  FaServer,
  FaDatabase,
  FaCloud,
  FaCubes,
  FaBrain,
  FaEnvelope,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";

const map = {
  code: FaCode,
  react: FaReact,
  server: FaServer,
  database: FaDatabase,
  cloud: FaCloud,
  cubes: FaCubes,
  brain: FaBrain,
  mail: FaEnvelope,
  linkedin: FaLinkedinIn,
  github: FaGithub,
};

export const Icon = ({ name, ...rest }) => {
  const Cmp = map[name] || FaCode;
  return <Cmp aria-hidden="true" {...rest} />;
};
