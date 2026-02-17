import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { GetUserProfileUseCase } from '../../application/use-cases/get-user-profile/get-user-profile.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user/update-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user/delete-user.use-case';
import { AuthGuard } from '../guards/auth.guard';

@Controller('users')
@UseGuards(AuthGuard)
export class UserProfileController {
  constructor(
    private getProfile: GetUserProfileUseCase,
    private updateUser: UpdateUserUseCase,
    private deleteUser: DeleteUserUseCase,
  ) {}

  @Get(':id')
  async get(@Param('id') id: string) {
    return await this.getProfile.execute(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: { name: string }) {
    return await this.updateUser.execute(id, body.name);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteUser.execute(id);
    return { message: 'User deleted successfully (Soft Delete)' };
  }
}
