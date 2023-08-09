import React from "react";

import Item from "@/atoms/Item";

import { LearningJourneyItemProps } from "./LearningJourney.types";

import styles from "./LearningJourneyItem.module.css";

function LearningJourneyItem(props: LearningJourneyItemProps) {
  const { itemNumber, title, href, children } = props;
  return (
    <Item href={href}>
      <div className={styles.learningJourneyItemContainer}>
        <div className={styles.learningJourneyItemContent}>
          <span className={styles.itemNumber}>{itemNumber}</span>
          <p className={styles.itemTitle}>{title}</p>
        </div>
        {children}
      </div>
    </Item>
  );
}

export default LearningJourneyItem;
