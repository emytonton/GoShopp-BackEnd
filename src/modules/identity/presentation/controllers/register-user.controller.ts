import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';

interface RegisterUserBody {
  name: string;
  email: string;
  password: string;
}

@Controller('users')
export class RegisterUserController {
  constructor(private registerUser: RegisterUserUseCase) {}

  @Post()
  async handle(@Body() body: RegisterUserBody) {
    const { name, email, password } = body;

    return await this.registerUser.execute({
      name,
      email,
      passwordRaw: password,
    });
  }
}
