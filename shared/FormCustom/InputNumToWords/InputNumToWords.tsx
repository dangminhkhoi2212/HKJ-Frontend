import React from "react";

const units = [
  "",
  "một",
  "hai",
  "ba",
  "bốn",
  "năm",
  "sáu",
  "bảy",
  "tám",
  "chín",
];
const teens = [
  "mười",
  "mười một",
  "mười hai",
  "mười ba",
  "mười bốn",
  "mười lăm",
  "mười sáu",
  "mười bảy",
  "mười tám",
  "mười chín",
];
const tens = [
  "",
  "mười",
  "hai mươi",
  "ba mươi",
  "bốn mươi",
  "năm mươi",
  "sáu mươi",
  "bảy mươi",
  "tám mươi",
  "chín mươi",
];
const scales = ["", "nghìn", "triệu", "tỷ"];

function readHundreds(num: number): string {
  if (num === 0) return "";

  let result = "";

  const hundred = Math.floor(num / 100);
  const remainder = num % 100;

  if (hundred > 0) {
    result += units[hundred] + " trăm ";
    if (remainder === 0) return result.trim();
  }

  if (remainder < 10) {
    if (remainder > 0) {
      result += (hundred > 0 ? "lẻ " : "") + units[remainder];
    }
  } else if (remainder < 20) {
    result += teens[remainder - 10];
  } else {
    const ten = Math.floor(remainder / 10);
    const unit = remainder % 10;
    result += tens[ten];
    if (unit > 0) {
      result += " " + (unit === 1 ? "mốt" : units[unit]);
    }
  }

  return result.trim();
}

export function numberToVietnameseWords(num: number): string {
  if (num === 0) return "không";
  if (num < 0) return "âm " + numberToVietnameseWords(Math.abs(num));

  let result = "";
  let scaleIndex = 0;

  while (num > 0) {
    const segment = num % 1000;
    if (segment > 0) {
      const segmentWords = readHundreds(segment);
      result =
        segmentWords +
        (scaleIndex > 0 ? " " + scales[scaleIndex] + " " : "") +
        result;
    }
    num = Math.floor(num / 1000);
    scaleIndex++;
  }

  return result.trim();
}

interface NumberToWordsProps {
  number: number;
  suffix?: string;
}

const NumberToWords: React.FC<NumberToWordsProps> = ({
  number,
  suffix = "đồng",
}) => {
  if (!number || number === 0) return <></>;
  const result = `${numberToVietnameseWords(number)} ${suffix}`;
  return (
    <span className="text-xs italic text-wrap m-0 p-0">
      {result.toUpperCase()}
    </span>
  );
};
export default NumberToWords;
