export type ButtonVariant =
  | "primary"
  | "secondary"
  | "muted"
  | "accent"
  | "black"
  | "gold"
  | "none"
  | "pink";

export type ButtonWidth = "normal" | "full" | "half";

export type ButtonProps = {
  variant?: ButtonVariant;
  width?: ButtonWidth;
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
};
