import { AppDataSource } from "../DataSource";
import { NextFunction, Request, Response } from "express";
import { Users } from "../entity/User";

export class UserController {
  private userRepository = AppDataSource.getRepository(Users);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.find();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const email = request.params.email;
    const users = await this.userRepository.find();
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      return "unregistered user";
    }
    return user;
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const { email, username } = request.body;
    const curUser = await this.userRepository.findOne({
      where: { email },
    });

    if (curUser) {
      return "already exist";
    }
    const user = Object.assign(new Users(), {
      email,
      username,
    });

    return this.userRepository.save(user);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const email = request.params.email;

    let userToRemove = await this.userRepository.findOneBy({ email });

    if (!userToRemove) {
      return "this user not exist";
    }

    await this.userRepository.remove(userToRemove);

    return "user has been removed";
  }
}
