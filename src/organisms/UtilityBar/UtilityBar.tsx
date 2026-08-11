import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, signOut } from "../../context/AuthContext";
import { UtilityBarProps } from "./UtilityBar.types";

function UtilityBar(props: UtilityBarProps): JSX.Element {
  const { activeLink = "HOME" } = props;
  const navigate = useNavigate();
  const { data: session } = useSession();
  const [showMobileNavBar, setShowMobileNavBar] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <>
      {/* ── Mobile drawer ──────────────────────────────────────────────────── */}

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          showMobileNavBar ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setShowMobileNavBar(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
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

        {/* Auth section */}
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
                  <p className="text-sm font-semibold text-gray-800">{session.user?.name?.split(" ")[0]}</p>
                  <p className="text-xs text-gray-400 truncate max-w-[160px]">{session.user?.email}</p>
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

      {/* ── Desktop / tablet navbar ─────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-30 w-full transition-all duration-300 ${
          scrolled
            ? "bg-green1/90 backdrop-blur-md shadow-sm border-b border-gold/10"
            : "bg-green1 border-b border-black/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">

          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex-shrink-0 focus:outline-none"
            aria-label="Home"
          >
            <img
              src="/redlobosLogo.png"
              width={52}
              height={52}
              alt="Red Lobos Group"
              className="transition-opacity hover:opacity-80"
            />
          </button>

          {/* Centre nav links — hidden on mobile */}
          <nav className="hidden tablet:flex items-center gap-1">
            {navigationLinks.map((link) => {
              const isActive = activeLink === link;
              return (
                <button
                  key={link}
                  onClick={() => navigate(getNavPath(link))}
                  className="relative px-3 py-2 group focus:outline-none"
                >
                  <span
                    className={`text-xs font-bold tracking-[0.12em] transition-colors duration-200 ${
                      isActive ? "text-gold" : "text-gray-700 group-hover:text-gold"
                    }`}
                  >
                    {link}
                  </span>
                  {/* Animated underline */}
                  <span
                    className={`absolute bottom-0.5 left-3 right-3 h-px bg-gold transition-transform duration-300 origin-left ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Right side — auth + instagram */}
          <div className="hidden tablet:flex items-center gap-4 flex-shrink-0">
            {session ? (
              <>
                {/* Avatar */}
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center gap-2.5 group focus:outline-none"
                  title="Go to Dashboard"
                >
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name ?? ""}
                      width={32}
                      height={32}
                      referrerPolicy="no-referrer"
                      className="rounded-full border-2 border-transparent group-hover:border-gold transition-all"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gold text-white flex items-center justify-center text-xs font-bold">
                      {session.user?.name?.[0] ?? "U"}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-gray-600 group-hover:text-gold transition-colors">
                    {session.user?.name?.split(" ")[0]}
                  </span>
                </button>

                {/* Divider */}
                <span className="w-px h-4 bg-gray-200" />

                {/* Sign out */}
                <button
                  onClick={() => signOut()}
                  className="text-xs font-bold tracking-[0.1em] text-gray-500 hover:text-gold transition-colors focus:outline-none"
                >
                  SIGN OUT
                </button>
              </>
            ) : (
              /* Sign in pill button */
              <button
                onClick={() => navigate("/signIn")}
                className="px-5 py-2 rounded-full border border-gold text-gold text-xs font-bold tracking-[0.1em] hover:bg-gold hover:text-white transition-all duration-200 focus:outline-none"
              >
                SIGN IN
              </button>
            )}

            {/* Instagram */}
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gold/10 transition-colors"
              aria-label="Instagram"
            >
              <img width={15} height={15} src="/instagram.png" alt="instagram" />
            </a>
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="tablet:hidden flex flex-col justify-center gap-[5px] p-2 focus:outline-none group"
            onClick={() => setShowMobileNavBar(true)}
            aria-label="Open menu"
            aria-expanded={showMobileNavBar}
          >
            <span className="block w-6 h-px bg-gray-700 group-hover:bg-gold transition-colors" />
            <span className="block w-4 h-px bg-gray-700 group-hover:bg-gold transition-colors" />
            <span className="block w-6 h-px bg-gray-700 group-hover:bg-gold transition-colors" />
          </button>
        </div>
      </header>
    </>
  );
}

export default UtilityBar;
