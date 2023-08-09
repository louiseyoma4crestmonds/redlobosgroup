import React from "react";
import classnames from "classnames";

import { HeadingProps } from "./Heading.types";

import styles from "./Heading.module.css";

function Heading(props: HeadingProps) {
  const {
    Tag,
    variant = "xl",
    mode = "light",
    className = "",
    children,
  } = props;

  const headingClassName = classnames(
    {
      [styles.heading]: true,
      [styles.headingXxl]: variant === "xxl",
      [styles.headingXl]: variant === "xl",
      [styles.headingLg]: variant === "lg",
      [styles.headingMd]: variant === "md",
      [styles.headingSm]: variant === "sm",
      [styles.headingXs]: variant === "xs",
      [styles.headingDark]: mode === "dark",
      [styles.headingLight]: mode === "light",
    },
    className
  );

  return <Tag className={headingClassName}>{children}</Tag>;
}

export default Heading;
