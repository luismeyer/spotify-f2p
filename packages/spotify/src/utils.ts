export const chunkArray = <T>(array: T[], chunk: number) => {
  const temp = [];

  for (let i = 0, j = array.length; i < j; i += chunk) {
    temp.push(array.slice(i, i + chunk));
  }

  return temp;
};

export const asyncIteration = async <T, R>(
  array: T[][],
  fc: (array: T[]) => Promise<R>,
) => {
  for (let i = 0; i <= array.length; i++) {
    const item = array[i];

    if (item) {
      await fc(item);
    }
  }
};
