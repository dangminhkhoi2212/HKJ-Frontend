import { default as dayjs } from "dayjs";

export const formatDate = (date: number) =>
  dayjs(date).format("DD/MM/YYYY - HH:mm");
