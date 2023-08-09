export type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type HeadingMode = "light" | "dark";

export type HeadingVarient =
  | "xxl" // H1
  | "xl" // H2
  | "lg" // H3
  | "md" // H4
  | "sm" // H5
  | "xs"; // H6

export type HeadingProps = {
  Tag: HeadingTag;
  variant?: HeadingVarient;
  mode?: HeadingMode;
  className?: string;
  children: React.ReactNode;
};
