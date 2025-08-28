import { Injectable } from '@nestjs/common';
import { UsersRepositoryItf } from './users.repository.interface';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository implements UsersRepositoryItf {
  private users: User[] = [
    new User(1, 'Bejo', 'password1', 'bejo@mail.com'),
    new User(2, 'Budi', 'password2', 'budi@mail.com'),
  ];
  getAll(): User[] {
    return this.users;
  }
  createUser(username: string, email: string): User {
    const user = new User(this.users.length + 1, username, 'password', email);
    this.users.push(user); // kenapa ini tidak memakai new user?
    return user; // kenapa ini tidak memakai new user?
  }
}
