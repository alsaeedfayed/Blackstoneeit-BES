import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ProjectsService } from 'src/app/modules/projects/services/projects.service';
import { UserService } from 'src/app/core/services/user.service';
import { RequestsCreateService } from 'src/app/modules/project-initiation/components/requests-create/services/requests.service';
import { Config } from 'src/app/core/config/api.config';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { TeamSearchComponent } from 'src/app/shared/components/team-search/team-search.component';

@Component({
  selector: 'app-projects-charter',
  templateUrl: './projects-charter.component.html',
  styleUrls: ['./projects-charter.component.scss']
})
export class ProjectsCharterComponent implements OnInit, OnChanges {
  @Input() data: any;
  @Input() lang: string;
  deliverablesStats;
  searchModel = {
    keyword: null,
    sortBy: null,
    page: 1,
    pageSize: 1000
  }
  filterModel = {
    "milestoneId": null,
    "status": null
  }
  risksStats: {};


  modalTitle = "";
  modalMode = "";
  memberToAddType = "";
  users = [];
  @ViewChild(TeamSearchComponent) teamSearchComponent;
  stakeholderForm: FormGroup;
  indexToBeDeleted = -1;
  confirmMsg = "";
  isStackholdersFormSubmitted: boolean = false;


  constructor(private translateService: TranslateService,
    private projectsService: ProjectsService,
    private popupService: PopupService,
    private http: HttpHandlerService,
    private toastr: ToastrService,
    private userService: UserService,
    private requestsService: RequestsCreateService,
    private fb: FormBuilder,
    private confirmationPopupService: ConfirmModalService
  ) { }

  isPmo = this.userService.getCurrentUserClaims().includes(4000)

  ngOnChanges(changes: SimpleChanges): void {
    if (this.data) {
      this.getDeliverables(this.searchModel, this.filterModel)
      this.risksStats = {
        low: this.data.risks.filter(item => item.assessment?.code === 'Low').length,
        medium: this.data.risks.filter(item => item.assessment?.code === 'Medium').length,
        high: this.data.risks.filter(item => item.assessment?.code === 'High').length,
        'very high': this.data.risks.filter(item => item.assessment?.code === 'VeryHigh').length,
        total: this.data.risks.length
      }
    }
  }

  async ngOnInit() {
    this.handleLangChange();
    await this.getUsers(this.searchModel);
  }

  async getUsers(searchModel) {
    this.users = (await this.requestsService.getUsers(searchModel).toPromise()).data;
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  getDeliverables(searchModel, filterModel) {
    this.projectsService.getProjectsDeliverables(this.data.id, searchModel, filterModel).subscribe(res => {
      this.deliverablesStats = {
        pending: res.data.filter(item => item.status === 'Pending').length,
        accepted: res.data.filter(item => item.status === 'Accepted').length,
        rejected: res.data.filter(item => item.status === 'Rejected').length,
        submitted: res.data.filter(item => item.status === 'Submitted').length,
        total: res.data.length
      }
    })
  }

  onAddTeamMember(state) {
    this.modalTitle = this.translateService.instant('projects.addTeamMembers')
    this.modalMode = 'internal-members';
    this.memberToAddType = state;

    if (this.memberToAddType === 'teamMember') {
      this.users.forEach(user => {
        const selectedMember = this.data?.teamMemebers?.find(teamMemeber => teamMemeber?.id === user?.id);

        if (!!selectedMember) {
          user.checked = true;
          this.teamSearchComponent?.selectedMembers.push(selectedMember);
        }
      });
    }
    this.popupService.open('select-team');
  }

  onAddExternalMembers() {
    this.modalTitle = this.translateService.instant('projects.addExternalStakeholders')
    this.modalMode = 'external-members'
    this.popupService.open('select-team')
    this.initStakeholderForm()
  }

  initStakeholderForm(data?) {
    const emailPattern =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.stakeholderForm = this.fb.group({
      id: [data?.id],
      name: [data?.name, Validators.required],
      companyName: [data?.companyName, Validators.required],
      email: [
        data?.email,
        [Validators.required, Validators.pattern(emailPattern)],
      ], phoneNumber: [data?.phoneNumber, Validators.required],
      position: [data?.position, Validators.required]
    })
  }

  get getStakeholderForm() {
    return this.stakeholderForm.controls
  }

  onPopupClose() {
    this.popupService.close()
    this.modalMode = '';
    if (this.teamSearchComponent) {
      this.teamSearchComponent.selectedMembers = [];
      this.teamSearchComponent.uncheckAll();
    }
  }

  submit() {
    if (this.modalMode == 'internal-members') {
      this.onTeamSelectSave();
    } else {
      this.isStackholdersFormSubmitted = true;
      this.onSaveExternalMember();
    }
  }

  onTeamSelectSave() {
    this.popupService.close();

    // remove checked form old members
    this.data.teamMemebers?.forEach(element => {
      let member = this.users?.find(user => user.id == element.id);
      member.checked = false;
    })

    this.data.teamMemebers = [];

    this.teamSearchComponent?.selectedMembers?.forEach(element => {
      let member = this.users?.find(user => user.id == element.id);
      // different object format until unify the users object
      member = {
        ...member,
        name: { en: member.fullName, ar: member.fullArabicName },
      }
      // update users array
      member.checked = true;
      this.data.teamMemebers.push(member);
    });

    this.http.post(Config.Projects.AddTeamMembers,
      {
        "projectId": this.data.id,
        "usersIds":
          this.data?.teamMemebers.map(member => {
            return member.id
          })
      }
    ).subscribe(data => {
      this.toastr.success(
        this.translateService.instant(
          'projects.projectTeamWasSuccessfullyUpdated'
        )
      );
    });

  }

  onSaveExternalMember() {
    if (this.stakeholderForm.valid) {
      let data = this.stakeholderForm.value;
      if (!data?.id)
        delete data.id;
      this.http.post(Config.Projects.AddExternalStakeholder,
        {
          "projectId": this.data.id,
          ...data
        }
      ).subscribe(data => {        
        if (this.modalTitle == this.translateService.instant('projects.addExternalStakeholders')){
          this.data.externalStakeholders.push(data);
        }  else {
          const index = this.data.externalStakeholders.findIndex(holder => holder.id === data.id);
          if (index !== -1) {
            this.data.externalStakeholders[index] = data;
          }
        }
        this.toastr.success(
          this.translateService.instant(
            'projects.externalStakeholdersWasSuccessfullyUpdated'
          )
        );
      });
      this.popupService.close()
      this.stakeholderForm.reset()
    }
  }
 
  

  onEditMember(index) {
    this.modalTitle = this.translateService.instant('projects.updateExternalStakeholders')
    this.modalMode = 'external-members'
    this.popupService.open('select-team')
    this.initStakeholderForm(this.data?.externalStakeholders[index]);
  }

  onDeleteMember(index) {
    this.indexToBeDeleted = index;
    this.confirmMsg = this.translateService.instant("projects.deleteStakeholderMsg") + " (" + this?.data.externalStakeholders[index].name + " )";
    this.confirmationPopupService.open();
  }

  deleteMember() {
    this.http.delete(Config.Projects.RemoveExternalStakeholder + '/' + this.data?.externalStakeholders[this.indexToBeDeleted]?.id
    ).subscribe(data => {
      this.data?.externalStakeholders.splice(this.indexToBeDeleted, 1);
      this.toastr.success(
        this.translateService.instant(
          'projects.externalStakeholdersWasSuccessfullyUpdated'
        )
      );
    });
  }

  getCategories() {
    return this.data?.categories?.map(category => { return category.title[this.lang] }).join(' , ')
  }

  getTypes() {
    return this.data?.types?.map(type => { return type.title[this.lang] }).join(' , ')
  }


}
