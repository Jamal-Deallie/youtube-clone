import { object, string, TypeOf } from 'zod';

export const loginSchema = {
  body: object({
    email: string({
      required_error: 'email is required',
    }).email("Not a valid email"),

    password: string({
      required_error: 'password is required',
    })
      //establish password rule that password should be 6-64 chars long
      .min(6, 'Password must be at least 6 characters long')
      .max(64, 'Password should not be longer than 64 characters'),
  }),
};

export type LoginBody = TypeOf<typeof loginSchema.body>;
