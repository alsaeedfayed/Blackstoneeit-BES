/* tslint:disable */

declare var Object: any;


export interface AccessTokenInterface {
  token: string;
  expires: string;
  userId: string;
  user: any;
  claims: any;
}

export interface User {
  id?: string;
  source?: string;
  userName?: string;
  fullName?: any;
  email?: string;
}

export interface MenuItem {
  categoryTitle: string;
  order: number;
  title: string;
  icon: string;
  routerLink: string;
  claims: any;
  realm?: any;
}


export interface Complexity {
  level: string;
  label: string;
}

export class Token implements AccessTokenInterface {
  token: string = null;
  expires: string = null;
  userId: string = null;
  user: any = null;
  claims: any = null;
  roles:any = null;
  position: string = null;
  refreshToken: string = null;
  constructor(data?: AccessTokenInterface) {
    Object.assign(this, data);
  }
}
