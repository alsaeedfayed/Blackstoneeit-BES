import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { ExternalMember } from '../../models/ExternalMember';
import { ExternalUsersService } from '../../services/external-committee-users/external-users.service';

@Component({
  selector: 'app-committee-external-members',
  templateUrl: './committee-external-members.component.html',
  styleUrls: ['./committee-external-members.component.scss']
})
export class CommitteeExternalMembersComponent extends ComponentBase implements OnInit {

  externalMembers: ExternalMember[] = null;

  isUpdating: boolean = true;
  @Input() language: string = '';
  @Input() isRequired: boolean = false;
  @Output() onAdd = new EventEmitter();

  //external Member modal vars
  isExternalMemberModelOpened: boolean = false;
  selectedExternalMember: ExternalMember = null
  deletedName: string = null;

  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private modelService: ModelService,
    private toastr: ToastrService,
    private confirmationPopupService: ConfirmModalService,
    private externalUsersService: ExternalUsersService,
  ) {
    super(translateService, translate);
  }

  ngOnInit(): void {
    this.externalMembers = this.externalUsersService.getExternalMembers();
  }

  // open new external member modal
  openNewExternalMemberModel(item: any = null) {
    this.selectedExternalMember = item;
    this.isExternalMemberModelOpened = true;
    this.modelService.open('new-external-member');
  }

  // close external member modal
  closeExternalMemberModel() {
    this.onAdd.emit(this.externalMembers.length > 0);
    this.isExternalMemberModelOpened = false;
    this.selectedExternalMember = null;
    this.modelService.close();
  }

  // delete external member
  deleteExternalMember(nameEn: string) {
    this.deletedName = nameEn;
    this.confirmationPopupService.open('delete-member');

  }

  deleteExternalMemberConfirmed() {
    this.confirmationPopupService.close('delete-member');
    if (this.externalUsersService.deleteExternalMemberByEnName(this.deletedName)) {
      this.toastr.success(this.translate.instant('committeesNewRequest.externalMembersRows.successDeleteMsg'));
      this.onAdd.emit();
    }
    else
      this.toastr.error(this.translate.instant('shared.noData'));
  }

}
