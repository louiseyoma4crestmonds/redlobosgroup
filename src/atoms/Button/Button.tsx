import classNames from "classnames";
import { ButtonProps } from "./Button.types";

import styles from "./Button.module.css";

function Button(props: ButtonProps) {
  const {
    variant = "primary",
    width = "normal",
    disabled = false,
    onClick,
    children,
  } = props;

  const btnClassName = classNames({
    [styles.btn]: true,
    [styles.btnFull]: width === "full",
    [styles.btnPrimary]: variant === "primary",
    [styles.btnSecondary]: variant === "secondary",
    [styles.btnMuted]: variant === "muted",
    [styles.btnAccent]: variant === "accent",
    [styles.btnBlack]: variant === "black",
  });

  const handleOnClick = () => onClick;

  return (
    <button
      type="button"
      className={btnClassName}
      onClick={handleOnClick()}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
