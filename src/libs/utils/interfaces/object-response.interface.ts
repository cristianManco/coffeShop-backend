export interface ObjectResponse<S> {
  ok: boolean;
  message: string;
  data: S;
}
