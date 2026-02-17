import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterUserUseCase } from './register-user.use-case';
import { User } from '../../../domain/entities/user.entity';
import { UsersRepository } from '../../../domain/repositories/users-repository.interface';

describe('Register User Use Case', () => {
  let registerUserUseCase: RegisterUserUseCase;
  let mockUsersRepository: jest.Mocked<UsersRepository>;

  beforeEach(() => {
    mockUsersRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
    } as unknown as jest.Mocked<UsersRepository>;

    registerUserUseCase = new RegisterUserUseCase(mockUsersRepository);
  });

  it('should be able to register a new user with hashed password', async () => {
    mockUsersRepository.findByEmail.mockResolvedValue(null);
    const createSpy = jest.spyOn(mockUsersRepository, 'create');

    const hashSpy = jest
      .spyOn(bcrypt, 'hash')
      .mockResolvedValue('fake_hash' as never);

    const result = await registerUserUseCase.execute({
      name: 'John Doe',
      email: 'john@example.com',
      passwordRaw: '123456',
    });

    expect(result).toHaveProperty('userId');
    expect(createSpy).toHaveBeenCalled();
    expect(hashSpy).toHaveBeenCalledWith('123456', 10);
  });

  it('should not be able to register with an existing email', async () => {
    const existingUser = User.create(
      {
        name: 'Existing',
        email: 'john@example.com',
        passwordHash: 'hash',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      'user-123',
    );

    mockUsersRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(
      registerUserUseCase.execute({
        name: 'Another John',
        email: 'john@example.com',
        passwordRaw: '654321',
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
