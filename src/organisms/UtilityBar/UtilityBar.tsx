import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, signOut } from "../../context/AuthContext";
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

  const navigationLinks = session
    ? [...baseLinks, "DASHBOARD", ...(session.isAdmin ? ["ADMIN"] : [])]
    : baseLinks;

  const handleNavClick = (link: string) => {
    navigate(getNavPath(link));
    setShowMobileNavBar(false);
  };

  return (
    <div>
      {/* ── Mobile modal drawer ────────────────────────────────────────────── */}

      {/* Backdrop — sits BEHIND the drawer, click to close */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          showMobileNavBar ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setShowMobileNavBar(false)}
        aria-hidden="true"
      />

      {/* Drawer — slides in from the left */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          showMobileNavBar ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 bg-green1 border-b border-gold/20 flex-shrink-0">
          <img
            src="/redlobosLogo.png"
            width={80}
            height={72}
            alt="Red Lobos logo"
            className="cursor-pointer"
            onClick={() => handleNavClick("HOME")}
          />
          <button
            onClick={() => setShowMobileNavBar(false)}
            className="p-2 rounded-full hover:bg-black/10 transition-colors"
            aria-label="Close menu"
          >
            <img src="/close.png" height={14} width={14} alt="close" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-2">
          {navigationLinks.map((link) => (
            <button
              key={link}
              onClick={() => handleNavClick(link)}
              className={`w-full text-left px-6 py-4 text-sm font-bold tracking-wider border-b border-gray-50 transition-colors ${
                activeLink === link
                  ? "text-gold bg-gold/5 border-l-2 border-l-gold"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gold"
              }`}
            >
              {link}
            </button>
          ))}
        </nav>

        {/* Auth section pinned to bottom */}
        <div className="flex-shrink-0 px-6 py-6 border-t border-gray-100 bg-white">
          {session ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name ?? ""}
                    width={36}
                    height={36}
                    referrerPolicy="no-referrer"
                    className="rounded-full border border-gold/30"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-sm">
                    {session.user?.name?.[0] ?? "U"}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {session.user?.name?.split(" ")[0]}
                  </p>
                  <p className="text-xs text-gray-400 truncate max-w-[160px]">
                    {session.user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { signOut(); setShowMobileNavBar(false); }}
                className="w-full py-2.5 rounded-lg border border-gold text-gold font-bold text-sm tracking-wider hover:bg-gold hover:text-white transition-colors"
              >
                SIGN OUT
              </button>
            </div>
          ) : (
            <button
              onClick={() => { navigate("/signIn"); setShowMobileNavBar(false); }}
              className="w-full py-2.5 rounded-lg bg-gold text-white font-bold text-sm tracking-wider hover:bg-black transition-colors"
            >
              SIGN IN
            </button>
          )}

          <div className="mt-5 flex items-center gap-3">
            <div className="border border-gray-200 p-2.5 cursor-pointer rounded-lg hover:bg-gray-50 transition-colors">
              <img width={15} height={15} src="/instagram.png" alt="instagram" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Desktop bar ────────────────────────────────────────────────────── */}
      <div className={styles.utilityBarContainer}>
        <div className="flex justify-between">
          <div className="w-4/6 phone:w-full self-center flex gap-x-48">
            <div className="self-center">
              <img src="/redlobosLogo.png" width={70} height={72} alt="logo" />
            </div>

            <div className="self-center laptop:inline-block desktop:inline-block tablet:inline-block phone:hidden">
              <div className="flex gap-x-12 text-lg font-bold">
                {navigationLinks.map((link) => (
                  <div
                    key={link}
                    tabIndex={0}
                    role="button"
                    onKeyDown={() => {}}
                    onClick={() => navigate(getNavPath(link))}
                    className={
                      activeLink === link
                        ? "text-gold cursor-pointer"
                        : "cursor-pointer"
                    }
                  >
                    {link}
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
          <button
            className="self-center phone:flex tablet:hidden desktop:hidden laptop:hidden cursor-pointer flex-col gap-1.5 p-1"
            onClick={() => setShowMobileNavBar(true)}
            aria-label="Open menu"
            aria-expanded={showMobileNavBar}
          >
            <span className="block w-6 h-0.5 bg-black" />
            <span className="block w-6 h-0.5 bg-black" />
            <span className="block w-6 h-0.5 bg-black" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default UtilityBar;
