import React, { useEffect, useRef, useState } from "react";
import Footer from "../../components/Shared/Footer";
import Navbar from "../../components/Shared/Navbar";
import ScrollToTopComponent from "../../components/Shared/ScrollToTopComponent";
import SocialLinks from "../../components/SocialLinks";
import About from "./About";
import Contact from "./Contact";
import Hero from "./Hero";
import Projects from "./Projects";
import Technologies from "./Technologies";
import Experience from "./Experience";
import ToggleSwitch from "../../components/ToggleSwitch";

const Home = () => {
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const technologiesRef = useRef(null);
  const testimonialsRef = useRef(null);
  const contactRef = useRef(null);
  const experienceRef = useRef(null);

  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  function scrollToTargetAdjusted(reference) {
    var element = reference;
    var headerOffset = 80;
    var elementPosition = element.getBoundingClientRect().top;
    var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }

  return (
    <>
      <div className="bg-white dark:bg-dark-black text-black dark:text-dark-text">
        <ToggleSwitch onThemeToggleClick={toggleTheme} />
        <ScrollToTopComponent />
        <Navbar
          onHomeClick={() => scrollToTargetAdjusted(heroRef.current)}
          onAboutClick={() => scrollToTargetAdjusted(aboutRef.current)}
          onProjectsClick={() => scrollToTargetAdjusted(projectsRef.current)}
          onTechnologiesClick={() =>
            scrollToTargetAdjusted(technologiesRef.current)
          }
          onExperienceClick={() =>
            scrollToTargetAdjusted(experienceRef.current)
          }
          onTestimonialsClick={() =>
            scrollToTargetAdjusted(testimonialsRef.current)
          }
          onContactClick={() => scrollToTargetAdjusted(contactRef.current)}
          onThemeToggleClick={toggleTheme}
          theme={theme}
        />
        <SocialLinks />
        <Hero
          ref={heroRef}
          onAboutClick={() => scrollToTargetAdjusted(aboutRef.current)}
          theme={theme}
        />
        <About ref={aboutRef} theme={theme} />
        <Technologies ref={technologiesRef} theme={theme} />
        <Experience ref={experienceRef} theme={theme} />
        <Projects ref={projectsRef} theme={theme} />
        <Contact ref={contactRef} theme={theme} />
        <Footer />
      </div>
    </>
  );
};

export default Home;
