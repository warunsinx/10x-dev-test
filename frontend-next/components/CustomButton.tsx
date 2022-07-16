import React from "react";
import Spinner from "./Spinner";

interface IProps {
  onClick?: () => void;
  text: string;
  color?: string;
  type?: "button" | "submit" | "reset" | undefined;
  height?: string;
  animate?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  cursor?: string;
}

export default function CustomButton({
  onClick = () => {},
  text,
  color = "bg-gradient-to-r from-indigo-500 to-indigo-600",
  type = "button",
  height = "h-12",
  animate = false,
  disabled = false,
  isLoading = false,
  cursor = "cursor-pointer",
}: IProps) {
  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={`px-3 ${height} ${disabled ? "bg-gray-300" : color} ${
        animate &&
        !disabled &&
        "transition ease-in-out delay-50 hover:scale-105 hover:bg-indigo-500 duration-200"
      } ${
        disabled ? "cursor-not-allowed" : cursor
      } w-full flex items-center justify-center text-white hover:opacity-90 select-none`}
    >
      <p className="font-bold p-0 m-0 flex items-center justify-center">
        {isLoading ? <Spinner /> : text}
      </p>
    </button>
  );
}
