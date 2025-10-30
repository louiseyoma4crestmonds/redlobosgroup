export type PanelVariant = "deepBlue" | "accent";

export type PanelProps = {
  hasShadow?: boolean;
  variant?: PanelVariant;
  children?: React.ReactNode;
};
