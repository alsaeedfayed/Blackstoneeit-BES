import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {AtachmentService} from 'src/app/core/services/atachment.service';
import {UserService} from 'src/app/core/services/user.service';
import {ProjectsService} from 'src/app/modules/projects/services/projects.service';
import {ConfirmModalService} from 'src/app/shared/confirm-modal/confirm-modal.service';
import {log} from "ng-zorro-antd/core/logger";

@Component({
  selector: 'app-projects-deliverables',
  templateUrl: './projects-deliverables.component.html',
  styleUrls: ['./projects-deliverables.component.scss']
})
export class ProjectsDeliverablesComponent implements OnInit, OnChanges {
  @ViewChild('phaseSelect') phaseSelect: any;
  @Input() projectData: any
  @Input() selectedMilestone: any
  @Input() isPmo: any
  @Input() isPm: any
  @Input() lang: string
  @Output() onDestroy: EventEmitter<any> = new EventEmitter();
  defaultMileStone: any;
  query: string
  active: number = 1
  isFilterDisplayed: boolean
  comment = new FormControl(null, Validators.required)
  currentUserData
  selectedDeliverable: number = 0
  deliverables: any
  delievrablesStats: any
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
  attachment
  selectedAction: any;
  actionDeliverable: any;
  displayLoadingModal: boolean
  deliverableStatusList = [
    {
      name: 'Pending',
      nameAr: 'قيد الانتظار',
      isDefault: false
    },
    {
      name: 'Submitted',
      nameAr: 'تم الإرسال',
      isDefault: false
    },
    {
      name: 'Accepted',
      nameAr: 'مقبول',
      isDefault: false
    },
    {
      name: 'Rejected',
      nameAr: 'مرفوض',
      isDefault: false
    },
  ]
  milestonesList: any = [];
  attachmentInfo: { title: any; extension: any; fileName: any; };
  attachments: any = []
  @Output() refreshParentComponent: EventEmitter<any> = new EventEmitter();

  constructor(private userService: UserService,
              private translateService: TranslateService,
              private toastr: ToastrService,
              private confirmationModalService: ConfirmModalService,
              private projectsService: ProjectsService,
              private attachmentService: AtachmentService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.projectData) {
      this.getDeliverablesStats()
      this.projectData.milestones.forEach((element, index) => {
        this.milestonesList.push({
          name: element.name.en,
          nameAr: element.name.ar,
          id: element.id,
          isDefault: false
        })
      });
      if (this.selectedMilestone) {

        this.milestonesList.map(item => item.isDefault = false)
        this.milestonesList.find(item => item?.id == this.selectedMilestone.id).isDefault = true
        this.defaultMileStone = this.milestonesList.find(item => item?.id == this.selectedMilestone.id).id
        this.onMilestoneSortChange(this.defaultMileStone)
      }
    }
  }

  ngOnInit() {
    this.currentUserData = this.userService.getCurrentUserData()
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  getDeliverablesStats() {
    this.displayLoadingModal = true
    this.projectsService.getDeliverablesStats(this.projectData?.id).subscribe(res => {
      delete res.total
      this.delievrablesStats = res
      this.getDeliverables(this.searchModel, this.filterModel)
    })
  }

  getDeliverables(searchModel, filterModel) {
    this.projectsService.getProjectsDeliverables(this.projectData.id, searchModel, filterModel).subscribe(res => {
      this.deliverables = res.data
      if (this.selectedMilestone) {
        this.deliverables = this.selectedMilestone.deliverables
        this.deliverables.forEach(element => {
          element["actions"] = res.data.find(item => item.id === element.id).actions
          element["status"] = res.data.find(item => item.id === element.id).status
        });
      }
      this.displayLoadingModal = false

    })
  }

  onAction(action, deliverableId) {
    if (this.comment.invalid && action !== 'reopen') {
      this.toastr.error(this.translateService.instant('projects.deliverableCommentValidationMsg'))
      return
    }
    this.confirmationModalService.open()
    this.selectedAction = action
    this.actionDeliverable = deliverableId
  }

  resetState() {
    this.confirmationModalService.close()
    this.getDeliverablesStats()
    this.refreshParentComponent.emit()
    this.getDeliverables(this.searchModel, this.filterModel)
    this.comment.reset()
    this.displayLoadingModal = false
    this.attachments = []
  }

  onFilechange(e) {
    this.displayLoadingModal = true
    this.projectsService.onUploadAttachment(e.target.files[0]).subscribe((res: any) => {
      this.attachments.push({
        title: e.target.files[0].name,
        extension: e.target.files[0].name.split('.').pop(),
        fileName: res.fileName,
        uploadedFileName: e.target.files[0].name
      })
      this.displayLoadingModal = false
    }, err => {
      this.toastr.error(err.message)
      this.displayLoadingModal = false
    })
  }

  onPopupConfirm(action, deliverableId) {
    this.displayLoadingModal = true

    const requestData = {
      deliverableId,
      comment: this.comment.value,
      attachments: this.attachments.map(item => ({
        fileName: item.fileName,
        extension: item.extension,
        uploadedFileName: item.uploadedFileName
      }))
    }
    if (action === 'submit') {
      this.projectsService.submitDeliverable(requestData).subscribe(res => {
        this.toastr.success(this.translateService.instant('projects.deliverableWasSuccessfullySubmitted'))
        this.resetState()

      }, err => {
        this.toastr.error(err.message[this.lang])
      })
    }
    if (action === 'reject') {
      this.projectsService.rejectDeliverable(requestData).subscribe(res => {
        this.toastr.success(this.translateService.instant('projects.deliverableWasSuccessfullyRejected'))
        this.resetState()
      }, err => {
        this.toastr.error(err.message[this.lang])
      })
    }
    if (action === 'accept') {
      this.projectsService.acceptDeliverable(requestData).subscribe(res => {
        this.toastr.success(this.translateService.instant('projects.deliverableWasSuccessfullyAccepted'))
        this.resetState()
      }, err => {
        this.toastr.error(err.message[this.lang])
      })
    }
    if (action === 'reopen') {
      this.projectsService.reopenDeliverable(deliverableId).subscribe(res => {
        this.toastr.success(this.translateService.instant('projects.deliverableReopenSuccessMsg'))
        this.resetState()
      }, err => {
        this.toastr.error(err.message[this.lang])
        this.displayLoadingModal = false
      })
    }

  }

  onStatusSortChange(e) {
    this.filterModel.status = e?.name;
    this.getDeliverables(this.searchModel, this.filterModel);
  }

  onMilestoneSortChange(e) {
    if (e !== undefined){
      if (typeof e == "number") {
        e = this.selectedMilestone

      }
      this.selectedMilestone = null;
      this.filterModel.milestoneId = e?.id;
      this.getDeliverables(this.searchModel, this.filterModel);
      // if (this.phaseSelect){
      //   this.phaseSelect.value = this.defaultMileStone.id
      //   this.phaseSelect.select = this.defaultMileStone
      // }
    }

  }

  removeAttachment(i) {
    this.attachments.splice(i, 1)
  }

  openFile(filename) {
    this.attachmentService.getAttachmentURLs(filename).subscribe(res => {
      window.open(res[0].fileUrl, "_blank");
    })
  }

  ngOnDestroy(): void {
    this.onDestroy.emit();

  }

}

