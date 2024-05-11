import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { RequestsCreateService } from '../../services/requests.service';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { TeamSearchComponent } from 'src/app/shared/components/team-search/team-search.component';

@Component({
  selector: 'app-requests-organization-form',
  templateUrl: './requests-organization-form.component.html',
  styleUrls: ['./requests-organization-form.component.scss']
})
export class RequestsOrganizationFormComponent implements OnInit, OnChanges {
  result: any = [];
  selectedSectorChildren: any;
  selectedDepartmentChildren: any;
  oraganizationForm: FormGroup;
  @Input() readOnly: boolean
  @Input() isFormSubmitted: boolean
  @Input() data
  @Input() sectorsList
  @Input() projectDeliveryTypes
  @Input() lang: string
  sectorsItems: any = []
  departmentsItems: any;
  areasItems: any;
  users: any;
  searchModel = {
    "FirstName": null,
    "PageSize": 1000,
    "PageIndex": 1,
  }
  @ViewChild(TeamSearchComponent) teamSearchComponent;
  memberToAddType: string;
  modalMode: string;
  stakeholderForm: FormGroup
  isStackholdersFormSubmitted: boolean
  modalTitle: string;

  constructor(private popupService: PopupService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private requestsService: RequestsCreateService) { }


  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit() {
    this.lang = this.translateService.currentLang;
    this.initOrganizationForm()
    if (!this.readOnly) {
      this.getUsers(this.searchModel)
      this.getSectorsList()
    }
  }

  getSectorsList() {
    this.requestsService.getSectors().subscribe(res => {
      this.sectorsList = res;
      this.sectorsList.forEach(obj => {
        obj.name = obj?.title?.en;
        obj.nameAr = obj?.title?.ar;
      });
    });
  }

  getDepartmentsList(sector) {
    this.selectedSectorChildren = null;
    this.selectedDepartmentChildren = null;

    this.requestsService.getDepartments(this.getOraganizationForm.sector.value)
      .subscribe(res => {
        this.selectedSectorChildren = res;
        this.selectedSectorChildren.forEach(obj => {
          obj.name = obj?.title?.en;
          obj.nameAr = obj?.title?.ar;
        });

        if (!this.selectedSectorChildren.some(child => child.id == this.getOraganizationForm.department.value)) {
          this.getOraganizationForm.department.setValue(null);
          this.getAreasList(null);
        }
      });
  }

  getAreasList(department) {
    if (this.getOraganizationForm.department.value) {
      this.requestsService.getAreas(this.getOraganizationForm.department.value)
        .subscribe(res => {
          this.selectedDepartmentChildren = res;
          this.selectedDepartmentChildren.forEach(obj => {
            obj.name = obj?.title?.en;
            obj.nameAr = obj?.title?.ar;
          });

          !this.selectedDepartmentChildren?.some(child => child.id == this.getOraganizationForm.area.value) &&
            this.getOraganizationForm.area.setValue(null);
        });
    } else {
      this.getOraganizationForm.area.setValue(null);
    }
  }

  getUsers(searchModel) {
    this.requestsService.getUsers(searchModel).subscribe(res => {
      this.users = res.data
    }, err => {

    })
  }

  onAddTeamMember(state) {
    if (state === 'projectManager') {
      this.modalTitle = this.translateService.instant('initiationForm.addProjectManager')
    } else if (state === 'sponsor') {
      this.modalTitle = this.translateService.instant('initiationForm.addSponsors')
    } else if (state === 'teamMember') {
      this.modalTitle = this.translateService.instant('initiationForm.addTeamMembers')
    }

    this.modalMode = 'internal-members'
    this.memberToAddType = state
    if (this.memberToAddType === 'sponsor') {
      const formArray: FormArray = this.oraganizationForm.controls.sponserIds as FormArray;
      this.users.forEach(element => {
        element.checked = formArray.controls.find(control => control.value.id === element.id)
        if (formArray.controls?.find(control => control?.value?.id === element?.id)?.value) {
          this.teamSearchComponent.selectedMembers.push(formArray.controls?.find(control => control?.value?.id === element?.id)?.value)
        }
      });
    }
    if (this.memberToAddType === 'teamMember') {
      const formArray: FormArray = this.oraganizationForm.controls.teamMemeberIds as FormArray;
      this.users.forEach(element => {
        element.checked = formArray.controls.find(control => control.value.id === element.id)
        if (formArray.controls?.find(control => control?.value?.id === element?.id)?.value) {
          this.teamSearchComponent.selectedMembers.push(formArray.controls?.find(control => control?.value?.id === element?.id)?.value)
        }
      });
    }
    this.popupService.open('select-team')
  }

  onPopupClose() {
    this.popupService.close();

    if (this.teamSearchComponent) {
      this.teamSearchComponent.selectedMembers = [];
      this.teamSearchComponent.uncheckAll();
    }
  }

  initOrganizationForm() {
    this.oraganizationForm = this.fb.group({
      managerId: [null, Validators.required],
      teamMemeberIds: new FormArray([]),
      sponserIds: new FormArray([], Validators.required),
      externalStakeholders: new FormArray([]),
      deliveryType: [null, Validators.required],
      sector: [null, Validators.required],
      area: [null],
      department: [null],
      externalEntities: [null]
    })

    this.oraganizationForm.statusChanges.subscribe(status => {
      this.requestsService.saveStepperState("planningForm", status === "VALID" ? true : false)
    })
  }

  get getOraganizationForm() {
    return this.oraganizationForm.controls
  }

  onTeamSelectSave() {
    this.popupService.close()
    if (this.memberToAddType === 'projectManager') {
      this.teamSearchComponent.selectedMembers.forEach(element => {
        this.oraganizationForm.controls.managerId.setValue(element)
      });
    }
    if (this.memberToAddType === 'sponsor') {
      const formArray: FormArray = this.oraganizationForm.controls.sponserIds as FormArray;
      while (formArray.length !== 0) {
        formArray.removeAt(0)
      }
      this.teamSearchComponent.selectedMembers.forEach(element => {
        formArray.push(new FormControl(element))
      });
    }
    if (this.memberToAddType === 'teamMember') {
      const formArray: FormArray = this.oraganizationForm.controls.teamMemeberIds as FormArray;
      while (formArray.length !== 0) {
        formArray.removeAt(0)
      }
      this.teamSearchComponent.selectedMembers.forEach(element => {
        formArray.push(new FormControl(element))
      });
    }
    this.teamSearchComponent.selectedMembers = []
    this.teamSearchComponent.uncheckAll()
    this.teamSearchComponent.query = null

  }

  onAddExternalMembers() {
    this.modalTitle = this.translateService.instant('initiationForm.addExternalStakeholders')
    this.modalMode = 'external-members'
    this.popupService.open('select-team')
    this.initStakeholderForm()
  }

  initStakeholderForm() {
    const emailPattern =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.stakeholderForm = this.fb.group({
      name: [null, Validators.required],
      companyName: [null, Validators.required],
      email: [
        null,
        [Validators.required, Validators.pattern(emailPattern)],
      ], phoneNumber: [null, Validators.required],
      position: [null, Validators.required]
    })
  }

  get getStakeholderForm() {
    return this.stakeholderForm.controls
  }

  onSaveExternalMember() {
    this.isStackholdersFormSubmitted = true
    if (this.stakeholderForm.valid) {
      const formArray: FormArray = this.oraganizationForm.controls.externalStakeholders as FormArray;
      formArray.push(new FormControl({ ...this.stakeholderForm.value, phoneNumber: `9715${this.stakeholderForm.value.phoneNumber}` }))
      this.popupService.close()
      this.stakeholderForm.reset()
      this.isStackholdersFormSubmitted = false
    }
  }

  onDeleteMember(formControl, index?) {
    if (formControl !== "managerId") {
      const formArray: FormArray = this.oraganizationForm.controls[formControl] as FormArray;
      formArray.removeAt(index)
    } else {
      this.oraganizationForm.controls.managerId.setValue(null)
    }
  }

  onDepartmentSelect(e) {
    this.selectedDepartmentChildren = null
    this.oraganizationForm.controls.area.reset()
    this.selectedDepartmentChildren = this.selectedSectorChildren.find(item => item.id == e.target.value).children
  }

  onDeliveryTypeChange(e) {
    if (e.code === "ExternalTeam") {
      this.oraganizationForm.controls.externalEntities.setValidators([Validators.required])
      this.oraganizationForm.controls.externalEntities.updateValueAndValidity()
    } else {
      this.oraganizationForm.controls.externalEntities.setValidators([])
      this.oraganizationForm.controls.externalEntities.patchValue(null)
      this.oraganizationForm.controls.externalEntities.updateValueAndValidity()
    }
  }






}
