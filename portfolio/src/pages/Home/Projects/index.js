import React from "react";
import SimpleTransition from "../../../components/SimpleTransition";
import SectionHeader from "../../../components/SectionHeader";

const Projects = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} className="relative my-8 container">
      <SectionHeader
        title="My Projects"
        subtitle="Projects"
        theme={props.theme}
        color="blue"
      />

      <div className="my-16">
        <SimpleTransition width="100%">
          <div className="flex flex-col justify-end items-end my-2">
            <h3 className="uppercase text-xs font-bold">React Native</h3>
            <h2 className=" text-3xl font-bold">AyeVee</h2>
          </div>
        </SimpleTransition>
        <div className="lg:flex ">
          <div className="flex-1">
            <SimpleTransition>
              <img
                src={require("../../../assets/images/Ayevee.png")}
                alt="project ayeevee"
                className="w-full max-w-full h-auto object-contain"
              />
            </SimpleTransition>
          </div>
          <div className="flex-1 flex flex-col items-start lg:items-end lg:mt-4 mx-2 lg:mx-0">
            <SimpleTransition>
              <div className="bg-white shadow-md border rounded-xl overflow-hidden my-2 dark:bg-white/40 dark:border-0 dark:shadow-white/10">
                <div className="flex items-end flex-col py-2 px-8 ">
                  <p className="font-Cormorant text-sm md:text-lg font-semibold italic text-primary-blue">
                    {"<p>"}
                  </p>
                  <p className="text-xs md:text-sm">
                    Built a scalable cross-platform mobile application for
                    Ayevee, a lifestyle content platform featuring star
                    performers across topics like Beauty, Travel, Entertainment,
                    and Sports. Architected a performant React Native codebase
                    with Redux state management and video streaming via MUX.
                  </p>
                  <p className="font-Cormorant text-sm md:text-lg font-semibold italic text-primary-blue">
                    {"</p>"}
                  </p>
                </div>
              </div>
            </SimpleTransition>
            <ul className="flex text-xs md:text-sm">
              <SimpleTransition>
                <li className="mx-2 ">React Native</li>
              </SimpleTransition>
              <SimpleTransition>
                <li className="mx-2">Redux</li>
              </SimpleTransition>
              <SimpleTransition>
                <li className="mx-2">MUX</li>
              </SimpleTransition>
              <SimpleTransition>
                <li className="mx-2">Firebase</li>
              </SimpleTransition>
            </ul>
          </div>
        </div>
      </div>

      <div className="my-16 lg:my-32">
        <SimpleTransition>
          <div className="flex flex-col items-start my-2">
            <h3 className="uppercase text-xs font-bold">Ionic</h3>
            <h2 className=" text-3xl font-bold">IMS Interpreter Mobile</h2>
          </div>
        </SimpleTransition>
        <div className="lg:flex flex-row-reverse">
          <div className="flex-1">
            <SimpleTransition>
              <img
                src={require("../../../assets/images/IMS.png")}
                alt="project interpreter"
                className="w-full max-w-full h-auto object-contain"
              />
            </SimpleTransition>
          </div>
          <div className="flex-1 flex flex-col items-start lg:items-end lg:mt-4 mx-2 lg:mx-0">
            <SimpleTransition>
              <div className="bg-white shadow-md border rounded-xl overflow-hidden my-2 dark:bg-white/40 dark:border-0 dark:shadow-white/10">
                <div className="flex items-end flex-col py-2 px-8 ">
                  <p className="font-Cormorant text-lg font-semibold italic text-primary-blue">
                    {"<p>"}
                  </p>
                  <p className="text-xs md:text-sm">
                    Engineered an enterprise-grade cross-platform interpreter
                    scheduling application for hospitals and clinics, built on
                    the award-winning Primaxis technology. Delivered a seamless
                    Ionic/Angular hybrid app that streamlined interpreter
                    bookings and reduced manual scheduling overhead.
                  </p>
                  <p className="font-Cormorant text-lg font-semibold italic text-primary-blue">
                    {"</p>"}
                  </p>
                </div>
              </div>
            </SimpleTransition>
            <SimpleTransition>
              <ul className="flex text-xs md:text-sm">
                <li className="mx-2 ">Ionic</li>
                <li className="mx-2">Cordova</li>
                <li className="mx-2">Angular Based</li>
              </ul>
            </SimpleTransition>
          </div>
        </div>
      </div>

      <div className="my-16">
        <SimpleTransition width="100%">
          <div className="flex flex-col justify-end items-end my-2">
            <h3 className="uppercase text-xs font-bold">React</h3>
            <h2 className=" text-3xl font-bold">SCT Home & Admin</h2>
          </div>
        </SimpleTransition>
        <div className="lg:flex ">
          <div className="flex-1">
            <SimpleTransition>
              <img
                src={require("../../../assets/images/SCT.png")}
                alt="project SCT Home"
                className="w-full max-w-full h-auto object-contain"
              />
            </SimpleTransition>
          </div>
          <div className="flex-1 flex flex-col items-start lg:items-end lg:mt-4 mx-2 lg:mx-0">
            <SimpleTransition>
              <div className="bg-white shadow-md border rounded-xl overflow-hidden my-2 dark:bg-white/40 dark:border-0 dark:shadow-white/10">
                <div className="flex items-end flex-col py-2 px-8 ">
                  <p className="font-Cormorant text-sm md:text-lg font-semibold italic text-primary-blue">
                    {"<p>"}
                  </p>
                  <p className="text-xs md:text-sm">
                    Developed a dynamic React web platform for SCT, including
                    a public landing page and a full-featured admin panel.
                    Built a CMS-style dynamic careers page enabling admins to
                    create, manage, and publish job listings — and applicants
                    to browse and apply — without any code changes.
                  </p>
                  <p className="font-Cormorant text-sm md:text-lg font-semibold italic text-primary-blue">
                    {"</p>"}
                  </p>
                </div>
              </div>
            </SimpleTransition>
            <SimpleTransition>
              <ul className="flex text-xs md:text-sm">
                <li className="mx-2 ">React Native</li>
                <li className="mx-2">Redux</li>
                <li className="mx-2">Tailwind Css</li>
                <li className="mx-2 hidden md:block">Firebase</li>
              </ul>
            </SimpleTransition>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Projects;
