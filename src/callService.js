import mockCallData from "./mockData";
export const fetchCallList = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCallData);
    }, 500); // 500ms delay
  });
};
