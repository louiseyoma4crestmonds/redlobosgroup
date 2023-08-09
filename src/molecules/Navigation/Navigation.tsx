import Link from "next/link";
import Image from "next/image";

import NavItemLink, { ItemLinkProps } from "@/atoms/NavItemLink";

import DashboardIcon from "@/atoms/Icons/Dashboard";
import LearningJourneyIcon from "@/atoms/Icons/LearningJourney";
import MyNotesIcon from "@/atoms/Icons/MyNotes";
import LeaderboardIcon from "@/atoms/Icons/Leaderboard";
import AcheivementsIcon from "@/atoms/Icons/Achievements";

import styles from "./Navigation.module.css";

const NavLinks = [
  {
    label: "Dashboard",
    href: "/",
    icon: () => <DashboardIcon />,
  },
  {
    label: "Learning Journey",
    href: "/learning-journey",
    icon: () => <LearningJourneyIcon />,
  },
  {
    label: "My Notes",
    href: "/notes",
    icon: () => <MyNotesIcon />,
  },
  {
    label: "Leaderboard",
    href: "/leaderboard",
    icon: () => <LeaderboardIcon />,
  },
  {
    label: "Achievements",
    href: "/achievements",
    icon: () => <AcheivementsIcon />,
  },
];

function Navigation() {
  return (
    <aside className={styles.sidebarContainer}>
      <nav className={styles.sidebarPrimaryNav}>
        <Link href="/">
          <a className={styles.sidebarBrand}>
            <Image
              src="/logo-light.svg"
              alt="Crest Learn"
              width={166}
              height={37}
            />
          </a>
        </Link>
        {NavLinks.length > 0 &&
          NavLinks.map((item: ItemLinkProps) => (
            <NavItemLink {...item} key={item.label} />
          ))}
      </nav>
    </aside>
  );
}

export default Navigation;
