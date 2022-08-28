import { UserModel } from './user.model';
import { User } from './user.model';
import { omit } from 'lodash';

//adding create user function to separate service file
//omit the comparePassword
export async function createUser(user: Omit<User, 'comparePassword'>) {
  return UserModel.create(user);
}

export async function findUserByEmail(email: User['email']) {
  return UserModel.findOne({ email });
}
