import { InMemoryDatabase } from "../../src/database/in-memory-database";
import { User } from "../../src/modules/User/models/user.model";
import { UserRepository } from "../../src/modules/User/repositories/user.repository";
import { UserService } from "../../src/modules/User/services/user.service";
import { NotFoundError } from "../../src/utility/errors";


describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let inMemoryUsers: InMemoryDatabase<User>;

  beforeEach(() => {
    inMemoryUsers = new InMemoryDatabase();
    userRepository = new UserRepository(inMemoryUsers);
    userService = new UserService(userRepository);
  });

  it('should create a user', () => {
    const userDTO = { name: 'John Doe' };
    const user = userService.createUser(userDTO);
    expect(user).toHaveProperty('id');
    expect(user.name).toBe('John Doe');
  });

  it('should throw error when creating a user with invalid data', () => {
    const userDTO = { name: '' };
    expect(() => userService.createUser(userDTO)).toThrow();
  });

  it('should find a user by id', () => {
    const userDTO = { name: 'John Doe' };
    const user = userService.createUser(userDTO);
    const foundUser = userService.findUserById(user.id);
    expect(foundUser).toEqual(user);
  });

  it('should throw NotFoundError if user is not found', () => {
    expect(() => userService.findUserById('nonexistent-id')).toThrow(NotFoundError);
  });

  it('should return all users', () => {
    const userDTO1 = { name: 'John Doe' };
    const userDTO2 = { name: 'Jane Doe' };
    userService.createUser(userDTO1);
    userService.createUser(userDTO2);
    const users = userService.getUsers();
    expect(users.length).toBe(2);
  });
});
