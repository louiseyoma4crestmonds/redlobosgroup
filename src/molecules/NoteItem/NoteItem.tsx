import React from "react";
import classnames from "classnames";

import Heading from "@/atoms/Heading";

import { NoteItemProps } from "./NoteItem.types";

import styles from "./NoteItem.module.css";

export default function NoteItem(props: NoteItemProps) {
  const { id, title, summary, timestamp, viewCallback, deleteCallback } = props;

  const onViewClick = () => {
    viewCallback(id); // TODO: pass full note object to parent component
  };

  const onDeleteClick = () => {
    deleteCallback(id); // TODO: pass full note object to parent component
  };

  return (
    <div className={styles.noteItemContainer}>
      <Heading Tag="h2" variant="sm" className="mb-3">
        {title}
      </Heading>
      <p className={styles.noteItemSummaryText}>{summary}</p>
      <div className={styles.noteItemFooter}>
        <div className={styles.timeStamp}>{timestamp}</div>
        <div className={styles.actions}>
          <button
            type="button"
            className={classnames({
              [styles.actionBtn]: true,
              [styles.actionBtnView]: true,
            })}
            onClick={() => onViewClick()}
          >
            View
          </button>
          <button
            type="button"
            className={classnames({
              [styles.actionBtn]: true,
              [styles.actionBtnDelete]: true,
            })}
            onClick={() => onDeleteClick()}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
