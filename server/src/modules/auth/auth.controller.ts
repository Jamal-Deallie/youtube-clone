import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { findUserByEmail } from '../user/user.service';
import { signJwt } from './auth.utils';
import omit from '../../helpers/omit';
import { LoginBody } from './auth.schema';

export async function loginHandler(
  req: Request<{}, {}, LoginBody>,
  res: Response
) {
  const { email, password } = req.body;

  //find user by email
  const user = await findUserByEmail(email);

  //check if user exist. if not return error message
  if (!user || !user.comparePassword(password)) {
    return (
      res
        .status(StatusCodes.UNAUTHORIZED)
        //don't specify which is incorrect for security purposes
        .send('invalid email or password')
    );
  }

  //create payload to put inside jwt
  //omit the password from the payload
  const payload = omit(user.toJSON(), ['password', '__v'] as any);

  //import jwt sign function and pass the payload
  const jwt = signJwt(payload);

  res.cookie('accessToken', jwt, {
    maxAge: 3.154e10, // 1 year
    //makes it our cookie can't be accessed by javascript, because it can be accessed by the http request
    httpOnly: true,
    //use env variable
    domain: 'localhost',
    path: '/',
    sameSite: 'strict',
    //set to false, but switch to true in dev mode
    secure: false,
  });

  return res.status(StatusCodes.OK).send(jwt);
  //if user exist verify password

  //if wrong password, return error message

  //assign a jwt token

  //add a cookie to the response

  //send response
}
