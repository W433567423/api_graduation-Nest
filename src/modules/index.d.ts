interface IUser {
  id: number;
  username: string;
  iat: number;
  exp: number;
}

interface IReqUser extends Request {
  user?: IUser;
}
export type { IUser, IReqUser };
