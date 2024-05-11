import { Injectable } from '@angular/core';
import { ExternalMember } from '../../models/ExternalMember';

@Injectable({
  providedIn: 'root'
})

export class ExternalUsersService {

  private externalMembers: ExternalMember[] = [];

  constructor() { }

  // get all ExternalMembers
  getExternalMembers(): ExternalMember[] {
    return this.externalMembers;
  }

  // set the ExternalMembers
  setExternalMembers(externalMembers: ExternalMember[] = []) {
    this.externalMembers = externalMembers;
  }

  // get ExternalMember data
  getExternalMemberByEnName(nameEn: string): ExternalMember {
    return this.externalMembers.find(mainTask => mainTask.name.en === nameEn);
  }

  //delete ExternalMember
  deleteExternalMemberByEnName(nameEn: string): boolean {
    let index = this.externalMembers.findIndex(t => t.name.en === nameEn);
    if (index >= 0) {
      this.externalMembers.splice(index, 1);
      return true;
    } else
      return false;
  }

  // update ExternalMembers
  updateExternalMember(member: ExternalMember, index: number): boolean {
    if (this.isDuplicated(member.name, index)) {
      return false;
    } else {
      this.externalMembers.splice(index, 1, member);
      return true;
    }
  }

  // add new ExternalMember
  AddExternalMember(member: ExternalMember): boolean {
    if (this.isDuplicated(member.name)) {
      return false;
    } else {
      this.externalMembers.push(member);
      return true;
    }
  }

  isDuplicated(name: any, index: number = -1): boolean {
    for (let i = 0; i < this.externalMembers.length; i++) {
      let externalMember = this.externalMembers[i];
      if (i != index && (externalMember.name.en == name.en || externalMember.name.ar == name.ar ))
        return true;
    }
    return false;
  }

  getExternalMemberIndex(nameEn: string): number {
    let index = this.externalMembers.findIndex(member => member.name.en === nameEn);
    return index;
  }
}