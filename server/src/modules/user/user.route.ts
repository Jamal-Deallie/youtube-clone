import express from 'express';
import { registerUserHandler } from './user.controller';
import { processRequestBody } from 'zod-express-middleware';
import { registerUserSchema } from './user.schema';
import requireUser from '../../middleware/requireUser';

const router = express.Router();

router.get('/', requireUser, (req, res) => {

  return res.send(res.locals.user);
});

router.post(
  '/',
  //processRequestBody sanitizes data to eliminate unwanted data in the request body
  processRequestBody(registerUserSchema.body),
  registerUserHandler
);

export default router;
