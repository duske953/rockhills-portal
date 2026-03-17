import sendResponse from './sendResponse';

type SendResponsePayload = {
  message: string;
  code: number;
};

interface AsyncFunction<T extends unknown[], R extends SendResponsePayload> {
  (...args: T): Promise<R>;
}

export default function tryCatchWrapper<
  T extends unknown[],
  R extends SendResponsePayload,
>(fn: AsyncFunction<T, R>): AsyncFunction<T, R> {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch {
      return sendResponse('Something went wrong', 500) as R;
    }
  };
}
