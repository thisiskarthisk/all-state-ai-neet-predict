const isDev = process.env.NODE_ENV !== 'production';

export const LOGGER = {
  log: (...args: any[]) => isDev && console.log(...args),
  warn: (...args: any[]) => console.warn(...args),
  error: (...args: any[]) => console.error(...args),
};
