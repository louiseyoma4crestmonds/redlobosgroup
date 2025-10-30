import classNames from "classnames";
import { PanelProps } from "./Panel.types";

import style from "./Panel.module.css";

function Panel(props: PanelProps): JSX.Element {
  const { children, hasShadow, variant } = props;
  const panelClassName = classNames({
    [style.panelWrapper]: true,
    [style.panelWrapperWithShadow]: hasShadow,
    [style.panelDeepBlue]: variant === "deepBlue",
  });

  return <div className={panelClassName}>{children}</div>;
}

export default Panel;
