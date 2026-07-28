const isDev = process.env.NODE_ENV !== 'production';

export const LOGGER = {
  log: (...args) => isDev && console.log(...args),
  warn: (...args) => console.warn(...args),
  error: (...args) => console.error(...args),
};
