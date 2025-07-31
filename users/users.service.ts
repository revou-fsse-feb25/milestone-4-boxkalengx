import { Injectable } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { User } from "./entities/user.entity";
import { UsersServiceItf } from "./users.service.interface";

@Injectable()
export class UsersService implements UsersServiceItf {
  constructor(private repo: UsersRepository) {}

  getAllUsers(): User[] {
    return this.repo.getAll();
  }

  listUsers(): User[] {
    return this.repo.getAll();
  }
  createUser(username: string, email: string): User {
    return this.repo.createUser(username, email);
  }
}
