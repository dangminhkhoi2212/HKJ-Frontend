/**
 * Find the difference between two arrays by a key.
 *
 * @param arrayA The first array.
 * @param arrayB The second array.
 * @param key The key to compare.
 * @returns The elements in arrayA that are not in arrayB.
 */
const findDifferenceByKey = (arrayA: any[], arrayB: any[], key: string) => {
  return arrayA.filter(
    (itemA) => !arrayB.some((itemB) => itemA[key] === itemB[key])
  );
};
const colectionUtil = { findDifferenceByKey };
export default colectionUtil;
