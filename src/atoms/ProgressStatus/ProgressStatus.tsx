import React from "react";
import classnames from "classnames";

import { ProgressStatusProps } from "./ProgressStatus.types";

import styles from "./ProgressStatus.module.css";

export default function ProgressStatus(props: ProgressStatusProps) {
  const { status } = props;

  const getStatusLabel = (): string => {
    switch (status) {
      case "notStarted":
        return "Not Started";
      case "inProgress":
        return "In Progress";
      case "completed":
        return "Completed";
      default:
        return "N/A";
    }
  };

  const progressStatusClassName = classnames({
    [styles.progressStatusContainer]: true,
    [styles.progressStatusNotStated]: status === "notStarted",
    [styles.progressStatusInProgress]: status === "inProgress",
    [styles.progressStatusCompleted]: status === "completed",
  });

  return <div className={progressStatusClassName}>{getStatusLabel()}</div>;
}
