import React, { useState } from "react";
import { ModuleType } from "../types/module.type";

import TransferBatchModule from "./TransferBatchModule";

export default function TransferModule({
  setModule,
  account,
}: {
  setModule: (module: ModuleType) => void;
  account: string;
}) {
  return <TransferBatchModule setModule={setModule} account={account} />;
}
