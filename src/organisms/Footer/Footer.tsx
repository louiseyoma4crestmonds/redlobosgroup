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
import { useRouter } from "next/router";

function Footer(): JSX.Element {
  const router = useRouter();
  return (
    <div className=" bg-redLobosFooterBackground">
      <div className="w-full pt-32 pb-16 px-6 space-y-8 tablet:space-y-0 tablet:flex tablet:justify-between tablet:px-24">
        <div>
          <Heading Tag="h1" variant="md">
            <span className="text-gold">RED LOBOS GROUP</span>
          </Heading>
        </div>

        <div className="tablet:w-2/12">
          <div>
            <Heading Tag="h1" variant="sm">
              <span className="text-white">CONTACT</span>
            </Heading>
          </div>

          <div className="text-gray1 space-y-4 mt-6">
            <div>
              <p>
                71-75 Shelton Street, Covent Garden, London, United Kingdom,
                WC2H 9JQ
              </p>
            </div>
            <div>
              <div className="underline">
                <p>prisca@redlobosgroup.com</p>
              </div>
              <div>+44-7424733629</div>
            </div>
          </div>
        </div>

        <div>
          <div>
            <Heading Tag="h1" variant="sm">
              <span className="text-white">USEFUL LINKS</span>
            </Heading>
          </div>

          <div className="mt-6 text-gray1 space-y-4">
            <div
              className="cursor-pointer"
              onClick={() => {
                router.push({ pathname: "/mission" });
              }}
            >
              About Us
            </div>
            <div className="cursor-pointer">Terms & Conditions</div>
            <div className="cursor-pointer">Privacy Policy</div>
          </div>
        </div>

        <div className="">
          <div>
            <Heading Tag="h1" variant="sm">
              <span className="text-white">NEWSLETTER</span>
            </Heading>
          </div>
          <div className="mt-3 flex w-full">
            <input
              className="py-4 px-4 rounded-l bg-[#343a40] outline-none"
              placeholder="Email address..."
            />

            <div className="bg-gold p-4 rounded-r text-white">SUBMIT</div>
          </div>
        </div>
      </div>
      <div className="w-full text-center text-gray1 pb-12">
        Copyright © Redlobosgroup 2023. All Rights Reserved
      </div>
    </div>
  );
}

export default Footer;
