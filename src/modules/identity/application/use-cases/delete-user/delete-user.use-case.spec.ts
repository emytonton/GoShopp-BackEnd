import { NotFoundException } from '@nestjs/common';
import { DeleteUserUseCase } from './delete-user.use-case';
import { User } from '../../../domain/entities/user.entity';
import { UsersRepository } from '../../../domain/repositories/users-repository.interface';

describe('Delete User Use Case', () => {
  let deleteUserUseCase: DeleteUserUseCase;
  let mockUsersRepository: jest.Mocked<UsersRepository>;

  beforeEach(() => {
    mockUsersRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
    } as unknown as jest.Mocked<UsersRepository>;

    deleteUserUseCase = new DeleteUserUseCase(mockUsersRepository);
  });

  it('should be able to soft delete an existing user', async () => {
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

    await deleteUserUseCase.execute('user-123');

    expect(user.isDeleted).toBe(true);

    expect(saveSpy).toHaveBeenCalledWith(user);
  });

  it('should throw an error if user does not exist', async () => {
    mockUsersRepository.findById.mockResolvedValue(null);

    await expect(deleteUserUseCase.execute('invalid-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
