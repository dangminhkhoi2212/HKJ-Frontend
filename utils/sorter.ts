export const sortDate = (a?: string, b?: string) =>
  new Date(a!).getTime() - new Date(b!).getTime();
export const sortName = (a?: string, b?: string) => a!.localeCompare(b!);
