import { User } from "./entities/user.entity";

export interface UsersServiceItf {
  getAllUsers(): User[];
  listUsers(): User[];
  createUser(username: string, email: string): User;
}
