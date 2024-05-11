import { Injectable } from '@angular/core';
import { memberTypes } from '../../enums/member-typ';

@Injectable({
  providedIn: 'root'
})
export class MembersTypesService {

  membersTypes = [
    {},
    { id: memberTypes.chairman, name: 'Chairman', nameAr: 'الرئيس' },
    { id: memberTypes.viceChairman, name: 'Vice Chairman', nameAr: 'نائب الرئيس' },
    { id: memberTypes.secretary, name: 'Secretary', nameAr: 'سكرتير' },
    { id: memberTypes.member, name: 'Member', nameAr: 'عضو' },
    { id: memberTypes.externalMember, name: 'External', nameAr: 'عضو خارجي' },
  ];

  constructor() { }

  getMembersTypes() {    
    return  this.membersTypes
  }
}
