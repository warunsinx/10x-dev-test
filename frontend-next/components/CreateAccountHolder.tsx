import React from "react";
import { PlusCircleIcon } from "@heroicons/react/outline";
import { ModuleType } from "../types/module.type";

export default function CreateAccountHolder({
  setModule,
}: {
  setModule: (module: ModuleType) => void;
}) {
  return (
    <div
      onClick={() => setModule("create")}
      className="w-full border-2 border-indigo-500 border-dashed p-20 mt-5 rounded-lg flex justify-center items-center hover:bg-indigo-900 bg-opacity-5 cursor-pointer"
    >
      <div className="flex items-center justify-center w-full space-x-1.5">
        <PlusCircleIcon className="text-yellow-500" height={25} />
        <p className="text-xl font-bold text-white">Create Bank Account</p>
      </div>
    </div>
  );
}
