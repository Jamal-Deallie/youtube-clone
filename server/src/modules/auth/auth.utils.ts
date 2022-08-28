import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const JWT_EXPIRES_IN = process.env.EXPIRES_IN || '7d';

//JWT Function to sign the JSON Web Token
export function signJwt(payload: string | Buffer | object) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}


//JWT Function to verify the JSON Web Token
export function verifyJwt(token: string) {
  //JWT verify method is used to verify the token. The method takes two arguments one is token string value, and second one is secret key for matching if the token is valid or not. The validation method returns a decoded object that we stored the token in.

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    //when the function returns null that means its not a valid

    return null;
  }
}
