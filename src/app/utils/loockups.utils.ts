
export function StructureLookups(list: any[],filterDisabled = true) {
  const newList: any = {};
  list.forEach((item: any) => {
    if (filterDisabled) newList[item.lookupType] = item.lookupResult.filter((lokkupItem) => lokkupItem.status);
    else newList[item.lookupType] = item.lookupResult;
  });
  return newList;
}
