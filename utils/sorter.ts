const sortDate = (a?: string, b?: string) =>
	new Date(a!).getTime() - new Date(b!).getTime();
const sortName = (a?: string, b?: string) => a!.localeCompare(b!);
const sortNumber = (a?: number, b?: number) => a! - b!;
const sortUitl = {
	sortDate,
	sortName,
	sortNumber,
};
export default sortUitl;
