import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AtachmentService } from 'src/app/core/services/atachment.service';
import { RequestsCreateService } from 'src/app/modules/project-initiation/components/requests-create/services/requests.service';
import { ProjectsService } from 'src/app/modules/projects/services/projects.service';
import { PopupService } from 'src/app/shared/popup/popup.service';

@Component({
  selector: 'app-projects-change-requests',
  templateUrl: './projects-change-requests.component.html',
  styleUrls: ['./projects-change-requests.component.scss']
})
export class ProjectsChangeRequestsComponent implements OnInit, OnChanges {
  @Input() projectData
  @Input() changeRequests
  @Input() lang: string;
  @Input() isPmo: boolean
  @Input() isPm: boolean
  mode: string = 'card'
  public isCollapsed: boolean[] = [];
  changeRequestTypes: any;
  changeRequestOptions: any;
  scheduleOptions: any;
  accordionActiveIds: any = [];
  organizationChangesFlag: boolean
  projectOrigins = []
  projectTypes = []
  projectCategories = []

  constructor(private popupService: PopupService,
    private projectsService: ProjectsService,
    private translateService: TranslateService,
    private attachmentService: AtachmentService,
    private toastr: ToastrService,
    private requestsCreateService: RequestsCreateService
  ) { }


  ngOnChanges(changes: SimpleChanges): void {
    if (this.projectData) {
      this.getChangeRequests(this.projectData.id)
    }
  }

  ngOnInit() {
    // this.handleLangChange();
    this.getChangeRequestTypes()
    this.getChangeRequestOptions()
    this.getOverviewLookups()
  }

  // private handleLangChange() {
  //   this.translateService.onLangChange.subscribe((language) => {
  //     this.lang = language.lang;
  //   });
  // }

  getChangeRequestOptions() {
    this.projectsService.getChangeRequestOptions().subscribe(res => {
      this.changeRequestOptions = res


      this.scheduleOptions = res.filter(item => item.code !== 'Decrease')
    })
  }

  getChangeRequestTypes() {
    this.projectsService.getChangeRequestTypes().subscribe(res => {
      this.changeRequestTypes = res.map(item => ({ ...item, highlightChanges: false }))

      res.forEach((element, index) => {
        this.accordionActiveIds.push('ngb-panel-' + index)
      });
      this.accordionActiveIds.push('ngb-panel-' + res.length + 1)
    })
  }

  getOverviewLookups() {
    this.requestsCreateService.getOverviewLookups().subscribe(res => {
      this.projectOrigins = res.find(item => item.lookupType === 'ProjectOrigin').result
      this.projectTypes = res.find(item => item.lookupType === 'ProjectType').result
      this.projectCategories = res.find(item => item.lookupType === 'ProjectCategory').result
    })
  }

  getChangeRequests(id) {
    this.projectsService.saveLoadingModalState(true)
    this.projectsService.getProjectChangeRequests(id).subscribe(res => {
      this.mode = 'card'
      this.changeRequests = res

      this.changeRequests.map(request=>{
        request.milestones.map(milestone=>{
          if(milestone.status.code === 'Edited') {
            request.showHighlightChanges = true;
            request.highlightMilestonesChanges = true;
          }
        })
      })

      this.projectsService.saveLoadingModalState(false)
    }, err => {
      this.toastr.error(err.message[this.lang])
    })
  }


  onJustifyToggle(requestId) {
    this.projectsService.onJustifyCrToggle(requestId).subscribe(res => {
    })
  }


  onCreateChangeRequest() {
    this.mode = 'create'
  }

  openFile(filename) {
    this.attachmentService.getAttachmentURLs(filename).subscribe(res => {
      window.open(res[0].fileUrl, "_blank");
    })
  }

  onBackToList() {
    this.mode = 'card'
  }

  get HasOpenRequests() {
    const openRequest = this.changeRequests?.find(request=>!request.status.isFinal)
    if(openRequest) return true;
    return false;
  }

}
