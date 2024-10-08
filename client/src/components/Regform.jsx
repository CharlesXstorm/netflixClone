// import React from 'react'
import { Link, useOutletContext } from "react-router-dom";

import Form from "./Form";

const Regform = () => {
  const context = useOutletContext();
  return (
    <div className="pb-[6em] xl:pb-[8em] border border-b-0 border-x-0">
      <p className="w-[95%] md:w-[50%] lg:w-[30%] m-[auto] px-5 lg:px-10 mt-10">
        STEP 1 OF 2
      </p>
      <Form
        type="signup"
        name="Create a password to start your membership"
        padding="px-5 py-2 pb-[6em] lg:px-10 lg:pb-[4em]"
        buttonName="Next"
        buttonType="button"
        buttonSize="text-[1.4em] w-[100%] mt-6 py-4 lg:py-2 xl:py-4"
        context={context}
        style={{
          input:
            "bg-white border-[rgb(0,0,0,0.5)] text-black w-[100%] p-4 lg:p-2",
          name: "text-black text-[1.8em]"
        }}
        check={{
          name: "Please do not email me Conflix special offers.",
          style: "my-4 text-sm",
          inputId: "singupPass"
        }}
        desc={{
          detail: (
            <>
              This is a portfolio project, use a random email.
              <br />
              Do not enter sensitive data.{" "}
              <a
                className="text-blue-600"
                href="https://www.github.com/CharlesXstorm/netflixClone"
                target="_blank"
              >
                Learn more.
              </a>
              <br />
              You can also <Link to="/login" className="text-blue-600">Sign-In</Link> as a
              guest without registering.
            </>
          ),
          style: "text-slate-600 lg:text-sm py-2"
        }}
      />
    </div>
  );
};

export default Regform;
