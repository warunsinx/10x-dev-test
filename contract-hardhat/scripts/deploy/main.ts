import { deployDaiToken } from "./deployDaiToken";
import { deployMulticall } from "./deployMulticall";
import { deployTenXBank } from "./deployTenXBank";

async function main() {
  await deployMulticall();
  await deployDaiToken();
  await deployTenXBank();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
