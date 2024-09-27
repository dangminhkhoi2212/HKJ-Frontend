import { default as dayjs } from "dayjs";

export const formatDate = (date: number | string) =>
  dayjs(date).format("DD/MM/YYYY - HH:mm");
