interface IResData<T> {
  code?: number;
  msg?: string;
  data?: T;
}

interface IUser {
  id: number;
  username: string;
  iat: number;
  exp: number;
}

interface IReqUser extends Request {
  user?: IUser;
}
export type { IUser, IReqUser, IResData };
