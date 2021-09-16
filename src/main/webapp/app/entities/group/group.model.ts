import { IUser } from "app/entities/user/user.model";

export interface IGroup {
  id?: number;
  name?: string | null;
  isDefault?: boolean | null;
  internalUser?: IUser | null;
}

export class Group implements IGroup {
  constructor(
    public id?: number,
    public name?: string | null,
    public isDefault?: boolean | null,
    public internalUser?: IUser | null
  ) {
    this.isDefault = this.isDefault ?? false;
  }
}

export function getGroupIdentifier(group: IGroup): number | undefined {
  return group.id;
}
