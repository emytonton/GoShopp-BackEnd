import { User } from './user.entity';

describe('User Entity', () => {
  const makeValidProps = () => ({
    name: 'John Doe',
    email: 'john@example.com',
    passwordHash: 'hashed_password',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  it('should be able to create a new user', () => {
    const user = User.create(makeValidProps());

    expect(user).toBeDefined();
    expect(user.name).toBe('John Doe');
    expect(user.isDeleted).toBe(false);
  });

  it('should not be able to create a user with invalid email', () => {
    expect(() => {
      User.create({ ...makeValidProps(), email: 'invalid-email' });
    }).toThrow('Invalid email address');
  });

  it('should be able to update user name', () => {
    const user = User.create(makeValidProps());
    user.updateName('Jane Doe');

    expect(user.name).toBe('Jane Doe');
  });

  it('should not be able to update user name with less than 3 characters', () => {
    const user = User.create(makeValidProps());

    expect(() => {
      user.updateName('Jo');
    }).toThrow('Name is too short');
  });

  it('should be able to soft delete a user', () => {
    const user = User.create(makeValidProps());
    user.delete();

    expect(user.isDeleted).toBe(true);
    expect(user.deletedAt).toBeInstanceOf(Date);
  });

  it('should not be able to delete an already deleted user', () => {
    const user = User.create(makeValidProps());

    user.delete();

    expect(() => {
      user.delete();
    }).toThrow('User is already deleted');
  });
});
