import sendResponse from './sendResponse';

interface AsyncFunction {
  (...args: any[]): Promise<any>;
}

export default function tryCatchWrapper(fn: AsyncFunction): AsyncFunction {
  return async (...args: any[]): Promise<any> => {
    try {
      return await fn(...args);
    } catch {
      return sendResponse('Something went wrong', 500);
    }
  };
}
