import { ObjectResponse } from './interfaces/object-response.interface';

export function res(
  ok: boolean,
  message: string,
  data: any,
): ObjectResponse<any> {
  return {
    ok,
    message,
    data,
  };
}
