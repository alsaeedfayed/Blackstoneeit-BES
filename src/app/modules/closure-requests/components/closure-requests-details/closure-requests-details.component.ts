import { PlatformLocation } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { AtachmentService } from 'src/app/core/services/atachment.service';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { ClosureRequestsService } from '../services/closure-requests.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ProjectsService } from 'src/app/modules/projects/services/projects.service';

@Component({
  selector: 'app-closure-requests-details',
  templateUrl: './closure-requests-details.component.html',
  styleUrls: ['./closure-requests-details.component.scss']
})
export class ClosureRequestsDetailsComponent extends ComponentBase implements OnInit {

  closureRequestData: any
  changeRequestId: any
  public instanceId: number;
  lang: string;
  active: number = 1
  accordionActiveIds: string[] = []
  displayLoadingModal: any;
  private subscriptions = new Subscription();
  forceActionSteps: any;
  form: FormGroup;
  details = new FormControl(null, Validators.required);
  status = new FormControl(null, Validators.required);
  questions: any = {};
  items = [
    {
      title: { en: "Achieved", ar: "تحقق" },
      code: "Yes"
    },
    {
      title: { en: "Not Achieved", ar: "لم يتحقق" },
      code: "No"
    },
  ]
  statusList: any;
  isRequester: boolean = false;

  constructor(
    private closureRequestsService: ClosureRequestsService,
    private toastr: ToastrService,
    private popupService: PopupService,
    private route: ActivatedRoute,
    translateService: TranslateConfigService,
    private attachmentService: AtachmentService,
    translate: TranslateService,
    public platformLocation: PlatformLocation,
    public fb: FormBuilder,
    private projectsService: ProjectsService,
    private http: HttpHandlerService,
    private router: Router,
  ) {
    super(translateService, translate);
    this.changeRequestId = this.route.snapshot.params['id']
  }

  ngOnInit() {
    this.getChangeRequestById(this.changeRequestId)
    this.lang = this.translateService.getSystemLang()
    this.closureRequestsService.displayLoadingModal.subscribe(state => {
      this.displayLoadingModal = state
    })
  }

  initClosureForm() {
    this.form = this.fb.group({
      details: this.fb.control(null),
      status: this.fb.control(null),
    })
  }

  getQuestions() {
    this.questions = []
    this.projectsService.getClosureQuestions().subscribe(res => {
      //Group questions based on category
      res.forEach((element, index) => {
        if (!element?.category)
          return
        this.form.addControl(element?.category?.title[this.lang], new FormArray([]))
        this.questions[element?.category?.title[this.lang]] = element.questions
      });
      Object.keys(this.questions).forEach((element, index) => {
        const currentCategoryControl: FormArray = this.form.controls[element] as FormArray
        this.questions[element].forEach(item => {
          currentCategoryControl.push(new FormGroup({
            id: new FormControl(item.id),
            question: new FormControl(null)
          }))
        });
      })
      this.getAnswers();
    })
  }

  getAnswers() {
    this.form.get('details').setValue(this.closureRequestData?.details);
    this.form.get('status').setValue(this.closureRequestData?.closedStatus?.id);
    for (const field in this.form.controls) {
      if (field != "details" && field != "status") {
        const control = this.form.get(field) as FormArray;
        const answer = this.closureRequestData.answers.filter(answer => {
          return answer?.category?.title?.en == field
        })[0];
        if (answer) {
          for (let index = 0; index < answer.questions.length; index++) {
            const questionId = answer.questions[index].question.id;
            let selectedItem = control.controls.filter(item => {
              return item.get('id').value == questionId
            })[0]
            if (selectedItem) {
              //console.log("selectedItem", answer.questions[index], answer.questions[index].achieved || answer.questions[index].answer);
              selectedItem.get('question').setValue(
                (answer.questions[index].achieved === true || answer.questions[index].achieved === false) ? answer.questions[index].achieved :
                  answer.questions[index].answer
              );
            }
          }
        }
      }
    }
  }

  toggle(data: any, control: FormControl) {
    control.setValue(data?.code == "Yes");
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  back() {
    this.platformLocation.back();
  }

  getChangeRequestById(id) {
    this.closureRequestsService.saveLoadingModalState(true)
    this.subscriptions.add(this.closureRequestsService.getClosureRequest(id).subscribe(res => {
      this.closureRequestData = res
      this.isRequester = (localStorage.getItem('$EPPM$userId') == this.closureRequestData?.createdBy?.id);
      this.instanceId = res?.instanceId;

      if (this.closureRequestData?.status?.mappedStatusCode == 'ReturnedForCorrection') {
        this.initClosureForm();
        this.getQuestions();
        this.getStatus();
      }

      this.accordionActiveIds.push('ngb-panel-' + 0);
      this.closureRequestData.answers.forEach((element, index) => {
        this.accordionActiveIds.push('ngb-panel-' + (index + 1));
      });

      this.accordionActiveIds.push('ngb-panel-' + (res.length + 1));
      this.closureRequestsService.saveLoadingModalState(false);
      this.getRequestInstances(res.instanceId);

    }, err => {
      this.toastr.error(err.message);
    }))
  }

  getStatus() {
    this.projectsService.getClosureStatus().subscribe(res => {
      res && res.forEach(obj => {
        obj.name = obj?.title?.en;
        obj.nameAr = obj?.title?.ar;
      });

      this.statusList = res;
    });
  }

  downloadFile(tempFilePath, fileName) {
    this.attachmentService.downloadFile(tempFilePath).subscribe(res => {
      const blob = res;
      const a = document.createElement('a');
      a.download = fileName;
      a.href = window.URL.createObjectURL(blob);
      document.body.appendChild(a);
      a.click();
    })
  }

  async updateClosureRequest() {
    let answers = [];
    if (this.form?.controls) {
      for (const field in this.form?.controls) {
        if (field != "details" && field != "status") {
          const control = this.form.get(field) as FormArray;
          for (let index = 0; index < control.controls.length; index++) {
            answers.push({
              id: 0,
              questionId: control.controls[index].get("id").value,
              achieved: (control.controls[index].get("question").value === true || control.controls[index].get("question").value === false) ? control.controls[index].get("question").value : undefined,
              answer: (control.controls[index].get("question").value !== true && control.controls[index].get("question").value !== false) ? control.controls[index].get("question").value : undefined
            });
          }
        }
      }
      // console.log("api",{
      //   id : this.closureRequestData.id,
      //   projectId : this.closureRequestData.project.id,
      //   isDraft : false,
      //   status : this.form.value.status,
      //   details : this.form.value.details,
      //   answers : answers
      // })
      // await this.http.post("/Eppm/api/Project/Closure/Register", {
      //   id : this.closureRequestData.id,
      //   projectId : this.closureRequestData.project.id,
      //   // isDraft : false,
      //   status : this.form.value.status,
      //   details : this.form.value.details,
      //   answers : answers
      // }).toPromise();
      await this.http.post("/Eppm/api/Project/Closure/Register", {
        id: this.closureRequestData.id,
        projectId: this.closureRequestData.project.id,
        // isDraft : false,
        status: this.form.value.status,
        details: this.form.value.details,
        answers: answers
      }).subscribe(res => {
        if (res) {
          this.toastr.success(this.translate.instant("closureRequests.successUpdateMsg"))
          this.router.navigateByUrl('/_reload', { skipLocationChange: true }).then(() => {
            this.router.navigateByUrl('closure-requests/details/' + this.closureRequestData.id,)
          })
        }
      })
    }
  }

  getRequestInstances(instanceId) {
    this.closureRequestsService.getInstanceStates(instanceId).subscribe(res => {
      this.forceActionSteps = res
    })
  }

  openFile(filename) {
    this.attachmentService.getAttachmentURLs(filename).subscribe(res => {
      window.open(res[0].fileUrl, "_blank");
    })
  }

  onActionClick(e) {
    this.closureRequestsService.savePopupConfig({
      optionId: e.id,
      title: e.title,
      btnLabel: e.label,
      mode: "workflow-form",
      isCommentRequired: e.isCommentRequired,
      action: e
    })
    this.popupService.open('closure-request')
  }

  async onActionConfirmed(e) {
    // if (!e) {
      // this.router.navigateByUrl('/_reload', { skipLocationChange: true }).then(() => {
      //   this.router.navigateByUrl('/closure-requests/details/' + this.closureRequestData.id,)
      // });
    this.getChangeRequestById(this.changeRequestId);
    // } else {


    //   this.closureRequestsService.saveLoadingModalState(true)

    //   if (e?.action?.type === 'ForceAction') {
    //     const requestData = {
    //       "comments": e?.comments,
    //       "attachments": e?.attachments,
    //       stateId: e?.stateId,
    //       instanceId: this.closureRequestData.instanceId
    //     }
    //     this.closureRequestsService.forceAction(requestData).subscribe(res => {
    //       this.toastr.success(this.translate.instant("shared.workflowActionSuccess"))
    //       this.getChangeRequestById(this.changeRequestId)
    //       this.popupService.close()
    //     }, err => {
    //       this.toastr.error(err.message)
    //       this.closureRequestsService.saveLoadingModalState(false)
    //     })
    //     return
    //   }

    //   if (e?.action?.type === 'Transition') {
    //     const requestData = {
    //       "optionId": e?.optionId,
    //       "comments": e?.comments,
    //       "attachments": e?.attachments
    //     }
    //     await this.updateClosureRequest();
    //     this.closureRequestsService.actionPerform(requestData).subscribe(res => {
    //       this.toastr.success(this.translate.instant("shared.workflowActionSuccess"))
    //       this.getChangeRequestById(this.changeRequestId)
    //       this.popupService.close()
    //     }, err => {
    //       this.toastr.error(err.message)
    //       this.closureRequestsService.saveLoadingModalState(false)
    //     })
    //     return
    //   }

    //   if (e?.action?.type === 'ReassignAction') {
    //     const requestData = {
    //       "comments": e?.comments,
    //       "attachments": e?.attachments,
    //       usersIds: e?.usersIds,
    //       taskId: e?.taskId
    //     }
    //     this.closureRequestsService.reassignAction(requestData).subscribe(res => {
    //       this.toastr.success(this.translate.instant("shared.workflowActionSuccess"))
    //       this.getChangeRequestById(this.changeRequestId)
    //       this.popupService.close()
    //     }, err => {
    //       this.toastr.error(err.message)
    //       this.closureRequestsService.saveLoadingModalState(false)
    //     })
    //     return
    //   }

    //   if (e?.action?.type === 'CancelReassign') {
    //     const requestData = {
    //       "comments": e?.comments,
    //       "attachments": e?.attachments,
    //       instanceId: this.closureRequestData.instanceId
    //     }
    //     this.closureRequestsService.cancelReassign(requestData).subscribe(res => {
    //       this.toastr.success(this.translate.instant("shared.workflowActionSuccess"))
    //       this.getChangeRequestById(this.changeRequestId)
    //       this.popupService.close()
    //     }, err => {
    //       this.toastr.error(err.message)
    //       this.closureRequestsService.saveLoadingModalState(false)
    //     })
    //     return
    //   }



    // }
  }

}
