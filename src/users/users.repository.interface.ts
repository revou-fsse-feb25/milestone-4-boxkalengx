import { User } from './entities/user.entity';

export interface UsersRepositoryItf {
  getAll(): User[];
  createUser(username: string, email: string): User;
}
