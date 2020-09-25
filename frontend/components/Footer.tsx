import React from "react";

const Footer: React.FC<{}> = () => {
  return (
    <footer className="absolute bottom-0 w-full h-12 p-3 border-t border-gray-300 bg-white text-center">
      <h1 className="text-lg tracking-tighter">
        ©{" "}
        <a
          href="https://github.com/mbresson/"
          title="mbresson's Github"
          target="blank"
        >
          mbresson {new Date().getFullYear()}
        </a>
      </h1>
    </footer>
  );
};

export default Footer;
