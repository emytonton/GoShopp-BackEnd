import { NotFoundException } from '@nestjs/common';
import { GetUserProfileUseCase } from './get-user-profile.use-case';
import { User } from '../../../domain/entities/user.entity';
import { UsersRepository } from '../../../domain/repositories/users-repository.interface';

describe('Get User Profile Use Case', () => {
  let getUserProfileUseCase: GetUserProfileUseCase;
  let mockUsersRepository: jest.Mocked<UsersRepository>;

  beforeEach(() => {
    mockUsersRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
    } as unknown as jest.Mocked<UsersRepository>;

    getUserProfileUseCase = new GetUserProfileUseCase(mockUsersRepository);
  });

  it('should be able to get user profile', async () => {
    const user = User.create(
      {
        name: 'John Doe',
        email: 'john@example.com',
        passwordHash: 'secret_hash',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      'user-123',
    );

    mockUsersRepository.findById.mockResolvedValue(user);

    const profile = await getUserProfileUseCase.execute('user-123');

    expect(profile.id).toBe('user-123');
    expect(profile.name).toBe('John Doe');
    expect(profile).not.toHaveProperty('passwordHash');
  });

  it('should throw an error if user does not exist', async () => {
    mockUsersRepository.findById.mockResolvedValue(null);

    await expect(getUserProfileUseCase.execute('invalid-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
