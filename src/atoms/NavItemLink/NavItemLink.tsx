import { useRouter } from "next/router";
import classNames from "classnames";
import Link from "next/link";
import { ItemLinkProps } from "./NavItemLink.types";

import styles from "./NavItemLink.module.css";

function NavItemLink(props: ItemLinkProps) {
  const { label, href, icon } = props;
  const router = useRouter();
  const Icon = icon;
  const linkClassName = classNames({
    [styles.navLink]: true,
    [styles.navLinkActive]: router.pathname === href,
  });
  return (
    <Link href={href}>
      <a className={linkClassName}>
        {Icon && <Icon />}
        <span className={styles.navLinkText}>{label}</span>
      </a>
    </Link>
  );
}

export default NavItemLink;
