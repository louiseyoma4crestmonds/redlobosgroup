import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Backdrop from "@/atoms/Backdrop";
import styles from "./UtilityBar.module.css";
import { UtilityBarProps } from "./UtilityBar.types";
import instagram from "../../../public/instagram.png";
import logo from "../../../public/redlobosLogo.png";
import close from "../../../public/close.png";

function UtilityBar(props: UtilityBarProps): JSX.Element {
  const { activeLink = "HOME" } = props;
  const router = useRouter();
  const [showMobileNavBar, setShowMobileNavBar] = useState(false);
  // const [showAboutDropdown, setShowAboutDropdown] = useState(false);
  const navigationLinks = ["HOME", "ABOUT", "PROPERTIES", "CONTACTS"];

  return (
    <div>
      {showMobileNavBar ? <Backdrop /> : null}

      <div className={showMobileNavBar ? "flex flex-row-reverse " : "hidden"}>
        <div className=" absolute z-50 bg-white h-screen w-10/12 border ">
          <div className="flex justify-between px-4 py-4 bg-green1 border-b">
            <div className="self-center ">
              <Image src={logo} width={100} height={90} alt="logo" />
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
              <Image src={close} height={16} width={16} />
            </div>
          </div>

          {navigationLinks.map((navigationLink: string) => (
            <div
              key={navigationLink}
              tabIndex={0}
              role="button"
              onKeyDown={() => {}}
              onClick={() => {
                router.push({
                  pathname: `/${navigationLink.toLowerCase()}`,
                });
              }}
              className={
                activeLink === navigationLink
                  ? "text-gold cursor-pointer py-4 border-b pl-8"
                  : "cursor-pointer py-4 border-b pl-8"
              }
            >
              {navigationLink}
            </div>
          ))}
          <div className="px-6 mt-6 flex justify-between">
            <div>
              <div className="self-center border p-4 cursor-pointer">
                <Image width={15} height={15} src={instagram} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.utilityBarContainer}>
        <div className="flex justify-between">
          <div className="w-4/6 phone:w-full self-center flex gap-x-48 ">
            <div className="self-center">
              <Image src={logo} width={70} height={72} alt="logo" />
            </div>

            <div className="self-center laptop:inline-block desktop:inline-block tablet:inline-block  phone:hidden">
              <div className="flex gap-x-12 text-lg font-bold">
                {navigationLinks.map((navigationLink: string) => (
                  <div
                    key={navigationLink}
                    tabIndex={0}
                    role="button"
                    onKeyDown={() => {}}
                    onClick={() => {
                      router.push({
                        pathname: `/${navigationLink.toLowerCase()}`,
                      });
                    }}
                    className={
                      activeLink === navigationLink
                        ? "text-gold cursor-pointer"
                        : "cursor-pointer"
                    }
                  >
                    {navigationLink}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className="laptop:hidden desktop:hidden phone:inline-block self-center space-y-1 cursor-pointer "
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
          <div className=" w-2/6 text-right self-center laptop:inline-block desktop:inline-block tablet:inline-block  phone:hidden">
            <div className="text-lg ">
              <div className="cursor-pointer text-gold">SIGN IN</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UtilityBar;
