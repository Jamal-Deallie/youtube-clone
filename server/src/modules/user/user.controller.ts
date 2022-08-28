import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { createUser } from './user.service';
import { RegisterUserBody } from './user.schema';

export async function registerUserHandler(
  req: Request<{}, {}, RegisterUserBody>,
  res: Response
) {
    console.log(req.body);
  //destructure body of the request
  const { username, email, password } = req.body;

  try {
    //create user using service function
    await createUser({ username, email, password });
    //return successful message response
    return res.status(StatusCodes.CREATED).send('user created successfully');
  } catch (e: any) {
    if (e.code === 11000) {
      //if the user is already registered send the following error

      return res.status(StatusCodes.CONFLICT).send('user already exist');
    }
    //if error is not use exist send general error message
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.message);
  }
}
