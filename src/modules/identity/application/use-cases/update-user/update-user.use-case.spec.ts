import { NotFoundException } from '@nestjs/common';
import { UpdateUserUseCase } from './update-user.use-case';
import { User } from '../../../domain/entities/user.entity';
import { UsersRepository } from '../../../domain/repositories/users-repository.interface';

describe('Update User Use Case', () => {
  let updateUserUseCase: UpdateUserUseCase;
  let mockUsersRepository: jest.Mocked<UsersRepository>;

  beforeEach(() => {
    mockUsersRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
    } as unknown as jest.Mocked<UsersRepository>;

    updateUserUseCase = new UpdateUserUseCase(mockUsersRepository);
  });

  it('should be able to update user name', async () => {
    const user = User.create(
      {
        name: 'John Doe',
        email: 'john@example.com',
        passwordHash: 'hash',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      'user-123',
    );

    mockUsersRepository.findById.mockResolvedValue(user);
    const saveSpy = jest.spyOn(mockUsersRepository, 'save');

    const result = await updateUserUseCase.execute('user-123', 'Jane Doe');

    expect(result.name).toBe('Jane Doe');
    expect(saveSpy).toHaveBeenCalledWith(user);
  });

  it('should throw an error if user does not exist', async () => {
    mockUsersRepository.findById.mockResolvedValue(null);

    await expect(
      updateUserUseCase.execute('invalid-id', 'Jane Doe'),
    ).rejects.toThrow(NotFoundException);
  });
});
