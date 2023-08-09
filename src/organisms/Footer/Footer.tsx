// import React, { useState } from "react";
// import Image from "next/image";

import Heading from "@/atoms/Heading";
/*
import styles from "./UtilityBar.module.css";
import twitter from "../../../public/twitter.png";
import instagram from "../../../public/instagram.png";
import linkedin from "../../../public/linkedin.png";
import facebook from "../../../public/facebook.png";
*/
function Footer(): JSX.Element {
  return (
    <div className="w-full bg-redLobosFooterBackground pt-32 pb-16 px-6 space-y-8">
      <div>
        <Heading Tag="h1" variant="md">
          <span className="text-gold">RED LOBOS GROUP</span>
        </Heading>
      </div>

      <div>
        <div>
          <Heading Tag="h1" variant="sm">
            <span className="text-white">CONTACT</span>
          </Heading>
        </div>

        <div className="text-[#6c757d]">
          <div>
            <p>1940 El Cajon Blvd, San Diego, CA 92104, United States</p>
          </div>
          <div className="underline">
            <p>info@redlobosgroup.com</p>
          </div>
          <div>+44 1234 1234</div>
        </div>
      </div>

      <div>
        <div>
          <Heading Tag="h1" variant="sm">
            <span className="text-white">USEFUL LINKS</span>
          </Heading>
        </div>

        <div className="text-[#6c757d]">
          <div>About Us</div>
          <div>Terms & Conditions</div>
          <div>Support Center</div>
          <div>Privacy Policy</div>
        </div>
      </div>

      <div className="w-full">
        <div>
          <Heading Tag="h1" variant="sm">
            <span className="text-white">NEWSLETTER</span>
          </Heading>
        </div>
        <div className="flex w-full">
          <input
            className="py-4 px-4 rounded-l bg-[#343a40] outline-none"
            placeholder="Email address..."
          />

          <div className="bg-gold p-4 rounded-r text-white">SUBMIT</div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
