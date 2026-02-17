import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginUseCase } from '../../application/use-cases/login/login.use-case';

interface LoginBody {
  email: string;
  password: string;
}

@Controller('auth')
export class LoginController {
  constructor(private loginUseCase: LoginUseCase) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async handle(@Body() body: LoginBody) {
    const { email, password } = body;

    return await this.loginUseCase.execute({
      email,
      passwordRaw: password,
    });
  }
}
