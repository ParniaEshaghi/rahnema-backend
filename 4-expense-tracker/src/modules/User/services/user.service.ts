import { NotFoundError } from '../../../utility/errors';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { User } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';

export class UserService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    findUserById(id: string) {
        const user = this.userRepository.findUserById(id);

        if (!user) throw new NotFoundError();

        return user;
    }

    createUser(createUserDTO: CreateUserDTO) {
        try {
            CreateUserDTO.parse(createUserDTO);
        } catch (error) {          
            throw error;
        }

        const { id, name } = createUserDTO;

        const newUser = new User(name, id);

        this.userRepository.addUser(newUser);

        return newUser;
    }

    getUsers() {
        return this.userRepository.getUsers();
    }
    
}
