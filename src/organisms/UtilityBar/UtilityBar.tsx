import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, signOut } from "../../context/AuthContext";
import Backdrop from "@/atoms/Backdrop";
import styles from "./UtilityBar.module.css";
import { UtilityBarProps } from "./UtilityBar.types";

function UtilityBar(props: UtilityBarProps): JSX.Element {
  const { activeLink = "HOME" } = props;
  const navigate = useNavigate();
  const { data: session } = useSession();
  const [showMobileNavBar, setShowMobileNavBar] = useState(false);

  const baseLinks = ["HOME", "ABOUT", "PROPERTIES", "CONTACTS"];

  const getNavPath = (link: string) => {
    if (link === "HOME") return "/";
    if (link === "DASHBOARD") return "/dashboard";
    if (link === "ADMIN") return "/admin";
    return `/${link.toLowerCase()}`;
  };

  // Show DASHBOARD when signed in; ADMIN only for admin users
  const navigationLinks = session
    ? [...baseLinks, "DASHBOARD", ...(session.isAdmin ? ["ADMIN"] : [])]
    : baseLinks;

  return (
    <div>
      {showMobileNavBar ? <Backdrop /> : null}

      {/* Mobile drawer */}
      <div className={showMobileNavBar ? "flex flex-row-reverse " : "hidden"}>
        <div className=" absolute z-50 bg-white h-screen w-10/12 border ">
          <div className="flex justify-between px-4 py-4 bg-green1 border-b">
            <div className="self-center ">
              <img src="/redlobosLogo.png" width={100} height={90} alt="logo" />
            </div>
            <div
              className="self-center cursor-pointer"
              tabIndex={0}
              role="button"
              onKeyDown={() => {}}
              onClick={() => setShowMobileNavBar(!showMobileNavBar)}
            >
              <img src="/close.png" height={16} width={16} alt="close" />
            </div>
          </div>

          {navigationLinks.map((navigationLink: string) => (
            <div
              key={navigationLink}
              tabIndex={0}
              role="button"
              onKeyDown={() => {}}
              onClick={() => navigate(getNavPath(navigationLink))}
              className={
                activeLink === navigationLink
                  ? "text-gold cursor-pointer py-4 border-b pl-8"
                  : "cursor-pointer py-4 border-b pl-8"
              }
            >
              {navigationLink}
            </div>
          ))}

          {session ? (
            <div className="py-4 border-b pl-8">
              <div className="text-sm mb-2">
                Hi, {session.user?.name?.split(" ")[0]}
              </div>
              <div
                tabIndex={0}
                role="button"
                onKeyDown={() => {}}
                onClick={() => signOut()}
                className="cursor-pointer text-gold font-bold"
              >
                SIGN OUT
              </div>
            </div>
          ) : (
            <div
              tabIndex={0}
              role="button"
              onKeyDown={() => {}}
              onClick={() => navigate("/signIn")}
              className="cursor-pointer py-4 border-b pl-8 text-gold font-bold"
            >
              SIGN IN
            </div>
          )}

          <div className="px-6 mt-6 flex justify-between">
            <div>
              <div className="self-center border p-4 cursor-pointer">
                <img width={15} height={15} src="/instagram.png" alt="instagram" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop bar */}
      <div className={styles.utilityBarContainer}>
        <div className="flex justify-between">
          <div className="w-4/6 phone:w-full self-center flex gap-x-48 ">
            <div className="self-center">
              <img src="/redlobosLogo.png" width={70} height={72} alt="logo" />
            </div>

            <div className="self-center laptop:inline-block desktop:inline-block tablet:inline-block phone:hidden">
              <div className="flex gap-x-12 text-lg font-bold">
                {navigationLinks.map((navigationLink: string) => (
                  <div
                    key={navigationLink}
                    tabIndex={0}
                    role="button"
                    onKeyDown={() => {}}
                    onClick={() => navigate(getNavPath(navigationLink))}
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

          <div className="self-center phone:hidden tablet:flex gap-x-4 items-center">
            {session ? (
              <div className="flex gap-x-4 items-center">
                {session.user?.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name ?? ""}
                    width={32}
                    height={32}
                    referrerPolicy="no-referrer"
                    className="rounded-full border border-gold/30 cursor-pointer"
                    onClick={() => navigate("/dashboard")}
                  />
                )}
                <span className="text-sm">
                  Hi, {session.user?.name?.split(" ")[0]}
                </span>
                <div
                  tabIndex={0}
                  role="button"
                  onKeyDown={() => {}}
                  onClick={() => signOut()}
                  className="cursor-pointer text-gold font-bold"
                >
                  SIGN OUT
                </div>
              </div>
            ) : (
              <div
                tabIndex={0}
                role="button"
                onKeyDown={() => {}}
                onClick={() => navigate("/signIn")}
                className="cursor-pointer text-gold font-bold"
              >
                SIGN IN
              </div>
            )}
            <div>
              <img width={15} height={15} src="/instagram.png" alt="instagram" />
            </div>
          </div>

          {/* Hamburger */}
          <div
            className="self-center phone:block tablet:hidden desktop:hidden laptop:hidden cursor-pointer"
            tabIndex={0}
            role="button"
            onKeyDown={() => {}}
            onClick={() => setShowMobileNavBar(!showMobileNavBar)}
          >
            <div className="space-y-1">
              <div className="w-6 h-0.5 bg-black" />
              <div className="w-6 h-0.5 bg-black" />
              <div className="w-6 h-0.5 bg-black" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UtilityBar;
