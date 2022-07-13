export const truncateAddress = (address: string) => {
  if (!address) return "";
  const left = address.substring(0, 5);
  const right = address.substring(address.length - 5);
  return `${left}...${right}`;
};
