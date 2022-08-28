import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../modules/auth/auth.utils';
//fun extracts and decodes the JWT
//make sure Req, Res, Next are in the order below
function deserializeUser(req: Request, res: Response, next: NextFunction) {
  //extract token from headers or cookie
  console.log('testing');
  const accessToken = (
    req.headers.authorization ||
    req.cookies.accessToken ||
    ''
  )
    //remove 'Bearer' from the token below
    .replace(/^Bearer\s/, '');

  //if the access token does not exist call the next function to exit function
  console.log(accessToken);
  if (!accessToken) {
    return next();
  }
  //otherwise verify the token
  const decoded = verifyJwt(accessToken);
  console.log(decoded);
  //and decode the token
  if (decoded) {
    res.locals.user = decoded;
  }

  return next();
}

export default deserializeUser;
