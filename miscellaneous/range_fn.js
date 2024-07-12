const range = (start, end) => {
  const len = Math.abs(end - start) + 1;
  const step = start < end ? 1 : -1;
  const arr = Array(len).fill(0).map((x,i) => step * i + start )
  return arr;
};


console.log(range(1, 5));  
console.log(range(5, 1));
