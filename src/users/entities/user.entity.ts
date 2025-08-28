export class User {
  id: number;
  username: string;
  password: string;
  email: string;
  isActive: boolean = true;

  constructor(
    id: number,
    username: string,
    password: string,
    email: string,
    isActive: boolean = true,
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.email = email;
    this.isActive = isActive;
  }
}
