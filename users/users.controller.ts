import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers(): User[] {
    return this.usersService.listUsers();
  }
  @Post()
  createUser(@Body("username") username: string, @Body("email") email: string): User {
    return this.usersService.createUser(username, email);
  }
}
