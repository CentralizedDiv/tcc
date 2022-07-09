interface UserClass extends IUser {}
class UserClass {}

export interface IUser {
  id: string;
  email: string;
  name: string;
}
export class User extends UserClass {}
