const timing: { [key: string]: number } = {};

const startTiming = (label: string) => {
  timing[label] = Date.now();
};

const endTiming = (label: string) => {
  console.log(`${label} ${Date.now() - timing[label]}ms`);
  delete timing[label];
};

export { startTiming, endTiming };
