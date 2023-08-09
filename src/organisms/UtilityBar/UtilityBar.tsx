import React, { useState } from "react";
import Image from "next/image";
import styled, { keyframes } from "styled-components";
import { slideInRight } from "react-animations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import the icons you need
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import Heading from "@/atoms/Heading";
import Backdrop from "@/atoms/Backdrop";

import styles from "./UtilityBar.module.css";
import twitter from "../../../public/twitter.png";
import instagram from "../../../public/instagram.png";
import linkedin from "../../../public/linkedin.png";
import facebook from "../../../public/facebook.png";

function UtilityBar(): JSX.Element {
  const [showMobileNavBar, setShowMobileNavBar] = useState(false);
  const slideInRightAnimation = keyframes`${slideInRight}`;

  const SlideInRightDiv = styled.div`
    animation: 1s ${slideInRightAnimation};
  `;

  return (
    <div>
      {showMobileNavBar ? <Backdrop /> : null}
      <SlideInRightDiv>
        <div className={showMobileNavBar ? "flex flex-row-reverse " : "hidden"}>
          <div className=" absolute z-50 bg-white h-screen w-10/12 border ">
            <div className="flex justify-between px-6 py-8 bg-green1 border-b">
              <div className="self-center ">
                <Heading Tag="h1" variant="md">
                  <span className="text-gold">RED LOBOS GROUP</span>
                </Heading>
              </div>

              <div
                className="self-center cursor-pointer"
                tabIndex={0}
                role="button"
                onKeyDown={() => {}}
                onClick={() => {
                  setShowMobileNavBar(!showMobileNavBar);
                }}
              >
                <Heading Tag="h1" variant="md">
                  <span className="">X</span>
                </Heading>
              </div>
            </div>
            <div className="px-6 py-2 border-b cursor-pointer flex justify-between">
              <div className="self-center">HOME</div>
              <div className="self-center">
                <FontAwesomeIcon
                  icon={faAngleDown}
                  style={{ fontSize: 20, color: "#BD9A68" }}
                />
              </div>
            </div>
            <div className="px-6 py-2 border-b cursor-pointer flex justify-between">
              <div className="self-center">ABOUT</div>
              <div className="self-center">
                <FontAwesomeIcon
                  icon={faAngleDown}
                  style={{ fontSize: 20, color: "#BD9A68" }}
                />
              </div>
            </div>
            <div className="px-6 py-2 border-b cursor-pointer flex justify-between">
              <div className="self-center">CONTACTS</div>
              <div className="self-center">
                <FontAwesomeIcon
                  icon={faAngleDown}
                  style={{ fontSize: 20, color: "#BD9A68" }}
                />
              </div>
            </div>
            <div className="px-6 mt-6 flex justify-between">
              <div>
                <div className="self-center border p-4 cursor-pointer">
                  <Image width={15} height={15} src={facebook} />
                </div>
              </div>
              <div>
                <div className="self-center border p-4 cursor-pointer">
                  <Image width={15} height={15} src={twitter} />
                </div>
              </div>
              <div>
                <div className="self-center border p-4 cursor-pointer">
                  <Image width={15} height={15} src={instagram} />
                </div>
              </div>
              <div>
                <div className="self-center border p-4 cursor-pointer">
                  <Image width={15} height={15} src={linkedin} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SlideInRightDiv>

      <div className={styles.utilityBarContainer}>
        <div className=" h-8 flex justify-between">
          <div className="self-center ">
            <Heading Tag="h1" variant="md">
              <span className="text-gold">RED LOBOS GROUP</span>
            </Heading>
          </div>
          <div
            className="self-center space-y-1 cursor-pointer"
            tabIndex={0}
            role="button"
            onKeyDown={() => {}}
            onClick={() => {
              setShowMobileNavBar(!showMobileNavBar);
            }}
          >
            <div className="h-1 w-6 bg-gold" />
            <div className="h-1 w-6 bg-gold" />
            <div className="h-1 w-6 bg-gold" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UtilityBar;
