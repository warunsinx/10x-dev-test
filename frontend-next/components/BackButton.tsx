import React from "react";
import { ArrowLeftIcon } from "@heroicons/react/outline";

export default function BackButton({
  backHandler,
}: {
  backHandler: () => void;
}) {
  return (
    <ArrowLeftIcon
      onClick={backHandler}
      className="mr-1.5 cursor-pointer hover:text-indigo-400 text-indigo-500"
      height={25}
    />
  );
}
