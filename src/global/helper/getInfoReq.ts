import { Request } from 'express';

const getInfoReq = (req: Request): any => {
  const { method, originalUrl: url, body, query, params, ip } = req;
  return {
    method,
    url,
    body,
    query,
    params,
    ip,
  };
};
export { getInfoReq };
