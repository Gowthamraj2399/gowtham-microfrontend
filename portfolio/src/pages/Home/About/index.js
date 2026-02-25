import React from "react";
import Document from "../../../assets/gowtham_resume.pdf";
import SimpleTransition from "../../../components/SimpleTransition";
import SectionHeader from "../../../components/SectionHeader";

const About = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} className="relative my-8 container">
      <div>
        <SectionHeader
          title="About Me"
          subtitle="About"
          theme={props.theme}
          color="red"
        />
      </div>
      <div className="lg:flex flex-1 justify-centermt-8">
        <div className="flex-1 ">
          <SimpleTransition>
            <img
              src={require("../../../assets/images/gritty3.png")}
              alt="Gowtham Raj"
            />
          </SimpleTransition>
        </div>
        <div className="flex-1 ">
          {/* <p className=" font-Cormorant text-lg font-semibold italic text-primary-red">
            {'<h2>'}
          </p>
          <h1 className="text-2xl font-bold  text-primary-blue">Short Note</h1>
          <h1 className="text-2xl font-bold text-secondary-blue">
            About Myself
          </h1>
          <p className=" font-Cormorant text-lg font-semibold italic text-primary-red">
            {'</h2>'}
          </p> */}
          <p className=" font-Cormorant text-lg font-semibold italic text-secondary-blue dark:text-white/40">
            {"<p>"}
          </p>
          <SimpleTransition>
            <p className="text-sm mb-4">
              I laid eyes on a computer when I was 12. Being from a remote part
              of the country, technology was something that I always heard of -
              but when I finally experienced it first-hand, there was no turning
              back.
            </p>
          </SimpleTransition>
          <SimpleTransition>
            <p className="text-sm mb-2">
              It was love at first sight. I dabbled into various technologies
              available at the time - and one thing led to another. Cut to
              today, I’m a proud Web/Mobile developer and I intend to hone my
              craft by expanding my knowledge and abilities in the domain of
              Computer Science.
            </p>
          </SimpleTransition>
          <p className=" font-Cormorant text-lg font-semibold italic text-secondary-blue dark:text-white/40">
            {"</p>"}
          </p>

          {/* <p className=" font-Cormorant text-lg font-semibold italic text-primary-red mt-4">
            {'<li>'}
          </p>
          <div className="text-sm">
            <ul className="flex items-center my-2">
              <li className="flex items-center mr-16">
                <FaBullseye className="text-xs mr-1" />
                <p>React</p>
              </li>
              <li className="flex items-center mr-16">
                <FaBullseye className="text-xs mr-1" />
                <p>React Native</p>
              </li>
              <li className="flex items-center mr-16">
                <FaBullseye className="text-xs mr-1" />
                <p>Angular</p>
              </li>
            </ul>
            <ul className="flex items-center my-2">
              <li className="flex items-center mr-16">
                <FaBullseye className="text-xs mr-1" />
                <p>Ionic</p>
              </li>
              <li className="flex items-center mr-16">
                <FaBullseye className="text-xs mr-1" />
                <p>NodeJs</p>
              </li>
              <li className="flex items-center mr-16">
                <FaBullseye className="text-xs mr-1" />
                <p>MongoDB</p>
              </li>
            </ul>
          </div>

          <p className=" font-Cormorant text-lg font-semibold italic text-primary-red ">
            {'</li>'}
          </p> */}

          <p className=" font-Cormorant text-lg font-semibold italic text-primary-red mt-4 dark:text-dark-primary/60">
            {"<button>"}
          </p>

          <div className="flex gap-2">
            <a href={Document} download>
              <SimpleTransition>
                <button className="py-1 px-4 shadow-xl my-2 font-semibold flex items-center bg-gradient-to-r text-white rounded-lg from-green-400 dark:from-dark-primary to-blue-500 hover:from-pink-500 hover:to-yellow-500">
                  Download Resume
                </button>
              </SimpleTransition>
            </a>
          </div>

          <p className=" font-Cormorant text-lg font-semibold italic text-primary-red dark:text-dark-primary/60">
            {"</button>"}
          </p>
        </div>
      </div>
    </div>
  );
});

export default About;
