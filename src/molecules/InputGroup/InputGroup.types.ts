import { InputSize, InputVariant } from "@/atoms/Input/Input.types";
import { ReactNode } from "react";


export type InputGroupProps = {
  type?: string;
  placeholder?: string;
  variant?: InputVariant;
  size?: InputSize;
  disabled?: boolean;
  value?: string;
  className?: string;
  icon?: ReactNode; 
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};