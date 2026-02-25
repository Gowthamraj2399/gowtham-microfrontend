import React from "react";
import { FaEnvelope, FaLinkedinIn, FaGithub } from "react-icons/fa";
import SimpleTransition from "../../../components/SimpleTransition";
import SectionHeader from "../../../components/SectionHeader";
import ContactBlock from "../../../components/ContactBlock";

const Contact = React.forwardRef((props, ref) => {
  const onLinkOpen = (event, link) => {
    console.log(event, link);
    event.preventDefault();
    window.open(link, "_blank");
  };

  const contactList = [
    {
      name: "gowthamraj2399@gmail.com",
      icon: <FaEnvelope className="text-4xl" />,
      link: "mailto:gowthamraj2399@gmail.com",
    },
    // {
    //   name: "+917550383887",
    //   icon: <FaPhoneAlt className="text-4xl" />,
    //   link: "tel:+917550383887"
    // },
    {
      name: "@gowthamraj-dev",
      icon: <FaLinkedinIn className="text-4xl" />,
      link: "https://www.linkedin.com/in/gowthamraj-dev/",
    },
    {
      name: "@Gowthamraj2399",
      icon: <FaGithub className="text-4xl" />,
      link: "https://github.com/Gowthamraj2399",
    },
  ];

  return (
    <div ref={ref} className=" py-4 container">
      <SimpleTransition width="100%">
        <div className="my-4 md:flex">
          <div className=" relative flex-1 flex items-center justify-center uppercase my-8 lg:pl-10 md:my-0 lg:after:content-[''] lg:after:absolute lg:after:right-0 lg:after:w-0.5 lg:after:h-20 lg:after:mx-4 after:bg-black dark:after:bg-white/80">
            <div className="flex flex-col items-center lg:justify-start lg:items-start text-3xl font-bold text-primary-blue dark:text-dark-text">
              <h3 className="">But Do i have</h3>
              <h3>all the </h3>
              <h3>answers?</h3>
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-center items-center">
            <h3 className="text-3xl font-bold text-primary-red mb-4">
              Absolutely Not!
            </h3>
            <p className="text-sm font-bold">
              But I am waiting to learn, unlearn, ask
            </p>
            <p className="text-sm font-bold">questions, fail, and get back.</p>
          </div>
        </div>
      </SimpleTransition>

      <SectionHeader
        title="Let's Talk"
        subtitle="Let's Talk"
        theme={props.theme}
        color="blue"
        align="center"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:my-16 lg:mx-28">
        {contactList.map((contact) => (
          <ContactBlock
            name={contact.name}
            icon={contact.icon}
            onClick={(event) => onLinkOpen(event, contact.link)}
          />
        ))}
      </div>

      <div className="flex justify-center items-center ">
        <p className="absolute left-4 md:left-16 font-Cormorant text-lg font-semibold italic text-pg-white mb-8">
          {"</body>"}
        </p>
      </div>
      <div className="flex mb-8">
        <p className="absolute left-1 md:left-8 font-Cormorant text-lg font-semibold italic text-pg-white">
          {"</html>"}
        </p>
      </div>
    </div>
  );
});

export default Contact;
