import { InputProps } from "./Input.types";

function Input(props: InputProps): JSX.Element {
  const {
    placeholder,
    icon,
    type,
    disabled,
    getInputedValue,
    variant = "default",
    size = "large",
    className,
  } = props;
  const variantClasses = {
    default: "border border-gray-300  focus:ring-1 focus:ring-green1",
    outlined: "border-2 border-green1  focus:ring-1 focus:ring-green1",
    filled: "bg-gray-100  focus:ring-1 focus:ring-green1",
    transparent: "border-0",
  };

  const sizeClasses = {
    small: "py-1 px-2 text-sm",
    medium: "py-2 px-3",
    large: "py-3 px-4 text-lg",
  };

  const withIcon = (
    <div className="flex gap-1 px-2 items-center bg-white border border-gray-300 rounded-md overflow-auto">
      <div>{icon}</div>
      <div>
        <input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(events) => {
            getInputedValue(events.target.value);
          }}
          className={`rounded-md text-lg text-gray-500 outline-none transition-all ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        />
      </div>
    </div>
  );

  const withoutIcon = (
    <input
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(events) => {
        getInputedValue(events.target.value);
      }}
      className={`rounded-md text-lg text-gray-500 outline-none transition-all ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    />
  );

  if (!icon) return withoutIcon;

  return withIcon;
}

export default Input;
