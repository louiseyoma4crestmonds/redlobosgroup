import Link from "next/link";

import { ItemProps } from "./Item.types";

import styles from "./Item.module.css";

function Item(props: ItemProps): JSX.Element {
  const { children, href = null } = props;

  if (href) {
    return (
      <Link href={href}>
        <a className={styles.itemWrapper}>{children}</a>
      </Link>
    );
  }

  return <div className={styles.itemWrapper}>{children}</div>;
}

Item.defaultProps = {
  href: "",
};

export default Item;
