import { group } from "console";
import { InMemoryDatabase } from "../../src/database/in-memory-database";
import { CreateGroupDTO } from "../../src/modules/Group/dtos/create-group.dto";
import { Group } from "../../src/modules/Group/models/group.model";
import { GroupRepository } from "../../src/modules/Group/repositories/group.repository";
import { GroupService } from "../../src/modules/Group/services/group.service";


describe('GroupService', () => {
  let groupService: GroupService;
  let groupRepository: GroupRepository;
  let inMemoryGroups: InMemoryDatabase<Group>;

  beforeEach(() => {
    inMemoryGroups = new InMemoryDatabase();
    groupRepository = new GroupRepository(inMemoryGroups);
    groupService = new GroupService(groupRepository);
  });

  it('should create a group', () => {
    const groupDTO: CreateGroupDTO = {
      name: 'Test Group',
      members: [{ id: '1', name: 'John Doe', groupId: '1', balance: 0, status: 'balanced' }]
    };
    const group = groupService.createGroup(groupDTO);
    expect(group).toHaveProperty('id');
    expect(group.name).toBe('Test Group');
  });

  it('should throw error when creating a group with invalid data', () => {
    const groupDTO: any = {
      name: '',
      members: []
    };
    expect(() => groupService.createGroup(groupDTO)).toThrow();
  });

  it('should find a group by id', () => {
    const groupDTO: CreateGroupDTO = {
      name: 'Test Group',
      members: [{ id: '1', name: 'John Doe', groupId: '1', balance: 0, status: 'balanced' }]
    };
    const group = groupService.createGroup(groupDTO);
    const foundGroup = groupService.findGroupById(group.id);
    expect(foundGroup).toEqual(group);
  });

  it('should throw error if group is not found', () => {
    expect(() => groupService.findGroupById('nonexistent-id')).toThrow();
  });

  it('should return all groups', () => {
    const groupDTO1: CreateGroupDTO = {
      name: 'Group 1',
      members: [{ id: '1', name: 'John Doe', groupId: '1', balance: 0, status: 'balanced' }]
    };
    const groupDTO2: CreateGroupDTO = {
      name: 'Group 2',
      members: [{ id: '2', name: 'Jane Doe', groupId: '2', balance: 0, status: 'balanced' }]
    };
    groupService.createGroup(groupDTO1);
    groupService.createGroup(groupDTO2);
    const groups = groupService.getGroups();
    expect(groups.length).toBe(2);
  });
});
