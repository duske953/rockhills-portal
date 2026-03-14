import sendResponse from './sendResponse';

interface AsyncFunction<T extends unknown[], R> {
  (...args: T): Promise<R>;
}

export default function tryCatchWrapper<T extends unknown[], R>(fn: AsyncFunction<T, R>): AsyncFunction<T, R | void> {
  return async (...args: T): Promise<R | void> => {
    try {
      return await fn(...args);
    } catch {
      return sendResponse('Something went wrong', 500) as unknown as void;
    }
  };
}
