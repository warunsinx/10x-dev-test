export const CONTRACT_ADDRESS = {
  DAI: "0xC799f291bD09DcA16d0a429e3995370860abBb12",
  TenXBank: "0xE757dc13524dD5F248d0fB6EB715ee9691bDb864",
  Multicall: "0x290C5Dad52234a452b222a2f9EFe07f75fb77924",
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
