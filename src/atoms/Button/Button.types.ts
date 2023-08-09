export type ButtonVariant =
  | "primary"
  | "secondary"
  | "muted"
  | "accent"
  | "black"
  | "none"
  | "pink";

export type ButtonWidth = "normal" | "full";

export type ButtonProps = {
  variant?: ButtonVariant;
  width?: ButtonWidth;
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
};
