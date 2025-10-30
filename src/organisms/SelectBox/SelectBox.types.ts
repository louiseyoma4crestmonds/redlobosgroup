export type Variant =
  | "select"
  | "rainbowSelect"
  | "text"
  | "submit"
  | "password";

export type SelectBoxProps = {
  variant?: Variant;
  selectOptions: any[];
  offBorder?: boolean;
  activeSelectOption?: string;
  label?: string;
  height?: number;
  value?: string;
  id?: string;
  getInputedValue: (inputedValue: any) => void;
};
