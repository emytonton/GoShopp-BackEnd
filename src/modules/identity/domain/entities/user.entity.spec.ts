import { User } from './user.entity';

describe('User Entity', () => {
  it('should be able to create a new user', () => {
    const user = User.create({
      name: 'John Doe',
      email: 'john@example.com',
      passwordHash: 'hashed_password',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(user).toBeDefined();
    expect(user.name).toBe('John Doe');
  });

  it('should not be able to create a user with invalid email', () => {
    expect(() => {
      User.create({
        name: 'John Doe',
        email: 'invalid-email',
        passwordHash: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }).toThrow('Invalid email address');
  });
});
