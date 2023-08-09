import React from "react";

import { ScoreSummaryCardProps } from "./ScoreSummaryCard.types";

import styles from "./ScoreSummaryCard.module.css";

export default function ScoreSummaryCard(props: ScoreSummaryCardProps) {
  const { title, score, children } = props;

  return (
    <div className={styles.scoreCardContainer}>
      <div className={styles.scoreCardBadge}>{children}</div>
      <div className={styles.scoreCardContent}>
        <span className={styles.scoreCardTitle}>{title}</span>
        <span>{score}</span>
      </div>
    </div>
  );
}
