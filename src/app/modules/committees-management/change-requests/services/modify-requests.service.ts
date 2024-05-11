import { Injectable } from '@angular/core';
import { membersTypes, modifyRequestsChangedTypes } from '../enums/modify-requests.enum';

@Injectable({
  providedIn: 'root'
})
export class ModifyRequestsService {

  constructor() { }

  changedTypes = [
    { id: modifyRequestsChangedTypes.NoChange, name: 'No Change', nameAr: 'لا تغيير', className: 'noChange' },
    { id: modifyRequestsChangedTypes.Added, name: 'Added', nameAr: 'تمت اضافته', className: 'Added' },
    { id: modifyRequestsChangedTypes.Edited, name: 'Updated', nameAr: 'تم تعديله', className: 'updated' },
    { id: modifyRequestsChangedTypes.Deleted, name: 'Removed', nameAr: 'تم حذفه', className: 'removed' },
  ];

  memberTypes = [
    {
      id : membersTypes.Chairman , name : 'Chairman' , nameAr : 'الرئيس'
    },
    {
      id : membersTypes.ViceChairman , name : 'Vice Chairman' , nameAr : 'نائب الرئيس'
    },
    {
      id : membersTypes.Secretary , name : 'Secretary' , nameAr : 'السكرتارية'
    },
    {
      id : membersTypes.Member , name : 'Member' , nameAr : 'عضو'
    }
  ]

  //return changed types
  getChangedTypes(){
    return this.changedTypes;
  }

  //return member types
  getMemberTypes(){
    return this.memberTypes;
  }

}
