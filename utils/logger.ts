const logger = {
  log: (...args: any[]): void => {
    console.log(...args);
  },
  error: (...args: any[]): void => {
    console.error(...args);
  },
};

export default logger;
