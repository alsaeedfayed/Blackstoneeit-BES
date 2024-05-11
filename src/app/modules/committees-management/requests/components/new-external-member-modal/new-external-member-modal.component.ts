import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ArabicLettersAndNumbersOnly } from 'src/app/core/helpers/Arabic-Letters-And-Numbers-Only.validator';
import { EnglishLettersAndNumbersWithComma } from 'src/app/core/helpers/Emglish-letters-Numbers-Comma';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { ExternalMember } from '../../models/ExternalMember';
import { ExternalUsersService } from '../../services/external-committee-users/external-users.service';
import { EmailAddress } from 'src/app/core/helpers/email.validator';

@Component({
  selector: 'app-new-external-member-modal',
  templateUrl: './new-external-member-modal.component.html',
  styleUrls: ['./new-external-member-modal.component.scss']
})
export class NewExternalMemberModalComponent implements OnInit {

  @Input() language: string = ''
  @Input() nameEn: string = ''
  member: ExternalMember = {} as ExternalMember;
  isUpdating: boolean = false;
  isBtnLoading: boolean = false;

  form: FormGroup = new FormGroup({});

  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private modelService: ModelService,
    private externalUsersService: ExternalUsersService,

  ) {

  }

  ngOnInit(): void {
    this.initFormControls();
    this.getMemberDetails();
  }

  // initialize form controls
  initFormControls() {
    this.form = this.fb.group({
      nameEn: [null, [Validators.required, Validators.maxLength(100), EnglishLettersAndNumbersWithComma()]],
      nameAr: [null, [Validators.required, Validators.maxLength(100), ArabicLettersAndNumbersOnly()]],
      position: [null, Validators.required],
      email: [null, [Validators.required, EmailAddress()]],
      phoneNumber: [null],
      entity: [null],
    });
  }

  //get member details
  getMemberDetails() {
    this.member = this.externalUsersService.getExternalMemberByEnName(this.nameEn);
    if (this.member) {
      this.isUpdating = true;
      this.patchForm();
    }
  }
  patchForm() {
    let formValues = {
      nameEn: this.member.name.en,
      nameAr: this.member.name.ar,
      email: this.member.email,
      position: this.member.position,
      phoneNumber: this.member.phoneNumber,
      entity: this.member.entity,
    }
    this.form.patchValue(formValues);
  }


  //save
  save() {
    // this.isBtnLoading = true;
    const member = {
      id: 0,
      name: { en: this.form.value.nameEn, ar: this.form.value.nameAr },
      email: this.form.value.email,
      phoneNumber: this.form.value.phoneNumber,
      position: this.form.value.position,
      entity: this.form.value.entity,
    };

    if (this.isUpdating) {
      member.id = this.member.id;
      this.updateExternalMember(member);
    } else {
      member.id = 0;
      this.addExternalMember(member);
    }
  }

  //add member
  addExternalMember(member: any) {
    if (this.externalUsersService.AddExternalMember(member)) {
      this.toastr.success(this.translate.instant('committeesNewRequest.externalMembersRows.successAddedMsg'));
      this.form.reset();
      this.closePopup();
    } else
      this.toastr.error(this.translate.instant('committeesNewRequest.externalMembersRows.duplicatedNames'));
  }

  //update Main TAsk
  updateExternalMember(member: any) {
    let index = this.externalUsersService.getExternalMemberIndex(this.nameEn);

    if (this.externalUsersService.updateExternalMember(member, index)) {
      this.toastr.success(this.translate.instant('committeesNewRequest.externalMembersRows.successUpdatedMsg'));
      this.form.reset();
      this.closePopup();

    } else
      this.toastr.error(this.translate.instant('committeesNewRequest.externalMembersRows.duplicatedNames'));
  }

  closePopup() {
    this.modelService.close();
  }


}
