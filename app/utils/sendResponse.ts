export default function sendResponse(
  message: string,
  code: number,
  data?: unknown,
) {
  return { message, code, data };
}
