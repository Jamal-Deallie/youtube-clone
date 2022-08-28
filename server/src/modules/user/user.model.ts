import { getModelForClass, prop, pre } from '@typegoose/typegoose';
import argon2 from 'argon2';

//will hash password
@pre<User>('save', async function (next) {
  //if password is new or modified, hash the password
  if (this.isModified('password') || this.isNew) {
    const hash = await argon2.hash(this.password);

    this.password = hash;

    return next();
  }
})
export class User {
  @prop({ required: true, unique: true })
  public username: string;

  @prop({ required: true, unique: true })
  public email: string;

  @prop({ required: true })
  public password: string;

  //compare the hashed password with the password stored in the user obj
  public async comparePassword(password: string): Promise<boolean> {
    //argon compares the password entered "this.password" with the password stored in the user obj
    return  argon2.verify(this.password, password);
  }
}

export const UserModel = getModelForClass(User, {
  //add an option to insert a timestamp when the user is created
  schemaOptions: {
    timestamps: true,
  },
});
