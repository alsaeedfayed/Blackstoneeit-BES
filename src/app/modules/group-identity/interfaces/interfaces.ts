export interface IGroupIdentity {
  readonly id: number;
  name: string;
  arabicName: string;
  path: string;
  level: number;
  children: IGroupIdentity[];
  parent: string;
  code: string;
}
