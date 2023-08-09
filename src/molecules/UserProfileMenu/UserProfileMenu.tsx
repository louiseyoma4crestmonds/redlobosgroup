import React, { useState, useRef } from "react";
import Link from "next/link";

import classnames from "classnames";
import { useOnClickOutside } from "usehooks-ts";
import ProfileImage from "@/atoms/ProfileImage";
import { UserProfileMenuProps } from "./UserProfileMenu.types";

import styles from "./UserProfileMenu.module.css";

function UserProfileMenu(props: UserProfileMenuProps) {
  const { name, jobRole, profileImage } = props;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  useOnClickOutside(dropdownRef, () => setShowMenu(false));

  const renderProfileDropdownMenu = () => (
    <div
      className={classnames({
        [styles.userProfileDropdownMenu]: true,
        [styles.userProfileDropdownMenuOpen]: showMenu,
      })}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      tabIndex={-1}
    >
      <div className="py-1" role="none">
        <Link href="/profile">
          <a
            className="text-gray-700 block px-4 py-2 text-sm border-b hover:bg-slate-50"
            role="menuitem"
            tabIndex={-1}
            id="menu-item-0"
          >
            Profile
          </a>
        </Link>
        <Link href="/profile">
          <a
            className="text-gray-700 block px-4 py-2 text-sm hover:bg-slate-50"
            role="menuitem"
            tabIndex={-1}
            id="menu-item-0"
          >
            Logout
          </a>
        </Link>
      </div>
    </div>
  );

  return (
    <div className={styles.userProfileMenuContainer}>
      <ProfileImage imageUrl={profileImage} />
      <div className="flex flex-col pl-3 justify-center">
        <span className="">{name}</span>
        <span className="text-xs text-crest-sub-text">{jobRole}</span>
      </div>
      <div ref={dropdownRef} className={styles.userProfileMenuToggle}>
        <button
          type="button"
          className={styles.userProfileMenuToggleButton}
          data-dropdown-toggle="dropdown"
          onClick={() => setShowMenu(!showMenu)}
        >
          <svg
            className={classnames({
              [styles.userProfileMenuToggleButtonIcon]: true,
              [styles.userProfileMenuToggleButtonIconOpen]: showMenu,
            })}
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {renderProfileDropdownMenu()}
      </div>
    </div>
  );
}

export default UserProfileMenu;
