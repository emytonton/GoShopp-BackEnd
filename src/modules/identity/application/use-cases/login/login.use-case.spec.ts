import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUseCase } from './login.use-case';
import { User } from '../../../domain/entities/user.entity';
import { UsersRepository } from '../../../domain/repositories/users-repository.interface';

describe('Login Use Case', () => {
  let loginUseCase: LoginUseCase;
  let mockUsersRepository: jest.Mocked<UsersRepository>;
  let mockJwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    mockUsersRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
    } as unknown as jest.Mocked<UsersRepository>;

    mockJwtService = {
      sign: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    loginUseCase = new LoginUseCase(mockUsersRepository, mockJwtService);
  });

  it('should be able to login with valid credentials', async () => {
    const user = User.create(
      {
        name: 'John Doe',
        email: 'john@example.com',
        passwordHash: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      'user-123',
    );

    mockUsersRepository.findByEmail.mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

    const signSpy = jest
      .spyOn(mockJwtService, 'sign')
      .mockReturnValue('fake-jwt-token');

    const result = await loginUseCase.execute({
      email: 'john@example.com',
      passwordRaw: '123456',
    });

    expect(result.accessToken).toBe('fake-jwt-token');

    expect(result.user).toEqual({
      id: 'user-123',
      name: 'John Doe',
      email: 'john@example.com',
    });

    expect(signSpy).toHaveBeenCalledWith({ sub: 'user-123' });
  });

  it('should not be able to login with wrong password', async () => {
    const user = User.create(
      {
        name: 'John',
        email: 'john@example.com',
        passwordHash: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      'user-123',
    );

    mockUsersRepository.findByEmail.mockResolvedValue(user);

    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

    await expect(
      loginUseCase.execute({
        email: 'john@example.com',
        passwordRaw: 'wrong-password',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should not be able to login if user does not exist', async () => {
    mockUsersRepository.findByEmail.mockResolvedValue(null);

    await expect(
      loginUseCase.execute({
        email: 'john@example.com',
        passwordRaw: '123456',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
