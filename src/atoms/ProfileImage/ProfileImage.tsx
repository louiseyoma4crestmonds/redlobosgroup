import React from "react";
import Image from "next/future/image";

import styles from "./ProfileImage.module.css";

import { ProfileImageProps } from "./ProfileImage.types";

function ProfileImage(props: ProfileImageProps) {
  const { imageUrl } = props;

  const renderImage = (url: string) => (
    <Image src={url} width="40" height="40" alt="Your profile picture" />
  );

  const renderPlaceholder = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );

  return (
    <div className={styles.profileImageContainer}>
      {imageUrl ? renderImage(imageUrl) : renderPlaceholder()}
    </div>
  );
}

export default ProfileImage;
