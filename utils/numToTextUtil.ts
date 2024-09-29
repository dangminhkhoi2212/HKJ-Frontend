function doc3So(numb: string): string {
  const numbName = [
    "Không",
    "Một",
    "Hai",
    "Ba",
    "Bốn",
    "Năm",
    "Sáu",
    "Bảy",
    "Tám",
    "Chín",
  ];

  const result = numb
    .toString()
    .split("")
    .reverse()
    .map((val: string, index: number) => {
      const level = ["", " Mươi", " Trăm"];
      return numbName[parseInt(val)] + level[index];
    })
    .reverse()
    .join(" ")
    .replace("Không Mươi", "Linh")
    .replace("Một Mươi", "Mười")
    .replace("Mươi Không", "Mươi")
    .replace("Mười Không", "Mười")
    .replace("Mươi Năm", "Mươi Lăm")
    .replace("Mươi Bốn", "Mươi Tư")
    .replace("Linh Bốn", "Linh Tư")
    .replace(" Linh Không", "");

  return result.trim();
}

const docNhieuSo = (numb: string): string => {
  const result = numb
    .toLocaleString()
    .split(",")
    .reverse()
    .map((val: string, index: number) => {
      const level = ["", " Nghìn", " Triệu", " Tỉ", " Nghìn", " Triệu"];
      if (parseInt(val) === 0) {
        if (index === 3) {
          return level[index];
        }
        return "";
      }
      return doc3So(val) + level[index];
    })
    .reverse()
    .join(" ")
    .trim()
    .replace("  ", " ");

  return result;
};
const numToTextUtitl = {
  doc3So,
  docNhieuSo,
};
export default numToTextUtitl;
