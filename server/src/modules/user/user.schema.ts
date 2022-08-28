import { object, string, TypeOf } from 'zod';

export const registerUserSchema = {
  body: object({
    username: string({
      required_error: 'username is required',
    }),

    email: string({
      required_error: 'email is required',
    }),

    password: string({
      required_error: 'password is required',
    })
    //establish password rule that password should be 6-64 chars long
      .min(6, 'Password must be at least 6 characters long')
      .max(64, 'Password should not be longer than 64 characters'),

    confirmPassword: string({
      required_error: 'password confirmation required',
    }),
    //we throw an error if the password and confirm password does not match
  }).refine(data => data.password === data.confirmPassword, {
    message: 'Password do not match',
    path: ['confirmPassword'],
  }),
};

export type RegisterUserBody = TypeOf<typeof registerUserSchema.body>;
