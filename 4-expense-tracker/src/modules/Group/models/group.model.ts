import { Member } from "./member.model";
import { v4 as uuidv4 } from 'uuid';

export class Group {
    id: string;
    name: string;
    members: Member[];

    constructor(name: string, members: Member[], id?: string) {
        this.id = id || uuidv4();
        this.name = name;
        this.members = members;
    }
}