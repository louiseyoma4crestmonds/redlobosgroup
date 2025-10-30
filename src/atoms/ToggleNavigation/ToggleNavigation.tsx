import { useState } from "react";
import styles from "./ToggleNavigation.module.css";

function ToggleNavigation({
  isActive,
  onClick,
}: {
  isActive: boolean;
  onClick: () => void;
}) {
  const [isChecked, setIsChecked] = useState(isActive);
  const onClickHandler = () => {
    setIsChecked(!isChecked);
    onClick();
  };

  return (
    <label className={styles.toggleNavigation} htmlFor="toggle-navigation">
      <input
        type="checkbox"
        className={styles.toggleNavigationTrigger}
        onClick={onClickHandler}
      />
      <div className={styles.toggleNavigationMenu} />
    </label>
  );
}

export default ToggleNavigation;
