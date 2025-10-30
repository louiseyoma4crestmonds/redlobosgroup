import { ReactNode } from "react";

export type InputVariant = "default" | "outlined" | "filled" | "transparent";
export type InputSize = "small" | "medium" | "large";


export type InputProps = {
  type?: string;
  placeholder?: string;
  variant?: InputVariant;
  // iconType?: "userIcon"|"messageIcon"|"dateIcon"
  icon?: ReactNode; 
  size?: InputSize;
  disabled?: boolean;
  value?: string;
  className?: string; 
  getInputedValue?: (inputedValue:any) => void
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
