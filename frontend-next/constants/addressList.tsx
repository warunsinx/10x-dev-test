export const CONTRACT_ADDRESS = {
  DAI: "0xc71FBD414ea941DbB68FFAe4Cf8D776D1EE859aF",
  TenXBank: "0x20d480c61A0AdD81B43Fab5987a711BCBAc961d4",
  Multicall: "0x128828e9ff96f2C55B388aAdf577CdCA78cC4a6f",
};

export const CONTRACT_NAMES = Object.entries(CONTRACT_ADDRESS).reduce<
  Record<string, string>
>((prev, cur) => {
  const [name, address]: any = cur;
  prev[address] = name;
  return prev;
}, {});

export const ADDRESS_LIST: Record<string, string> = {
  ...CONTRACT_ADDRESS,
  ...Object.values(CONTRACT_ADDRESS).reduce<Record<string, string>>(
    (prev, cur: any) => {
      prev[cur] = cur;
      return prev;
    },
    {}
  ),
};
