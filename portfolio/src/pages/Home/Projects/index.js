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
                    Developed Ayevee’s mobile app - a lifestyle content based
                    platform. The app features star performers and anchors
                    ranging from topics from lifestyle, Beauty, Travel, Gender,
                    Entertainment, Sports and more.
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
                    Key member in the development of IMS interpreter mobile.
                    Powered by the award-winning Primaxis technology, IMS solves
                    for scheduling interpreters in hospitals and clinics. The
                    application is now in final stages of testing.
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
                    Developed SCT Home and Admin’s Landing pages. In addition,
                    developed a one-of-a-kind dynamic career’s page that helps
                    admins and job recruits from the organisation manage
                    applications with ease.
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
