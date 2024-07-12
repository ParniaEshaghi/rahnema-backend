const array = [1, 2, 3, 4];
const resultMap = array.map(x => x * 2);
console.log(resultMap);

const mapWithReduce = (arr, mapFn) => {
  return arr.reduce((prev, curr) => {
    prev.push(mapFn(curr));
    return prev;
  }, []);
};

const resultReduce = mapWithReduce(array, x => x * 2);
console.log(resultReduce);
