import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AtachmentService } from 'src/app/core/services/atachment.service';
import { ProjectsService } from 'src/app/modules/projects/services/projects.service';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { PopupService } from 'src/app/shared/popup/popup.service';

@Component({
  selector: 'app-projects-risks',
  templateUrl: './projects-risks.component.html',
  styleUrls: ['./projects-risks.component.scss']
})
export class ProjectsRisksComponent implements OnInit, OnChanges {
  @Input() lang: string;
  @Input() data
  @Input() likelihoods
  @Input() impacts
  @Input() isPmo
  @Input() isPm

  deleteLabel: string = this.translateService.instant('shared.delete');
  editLabel: string = this.translateService.instant('shared.edit');
  riskDropdownOptions: any = [
    {
      item: this.editLabel,
      icon: 'bx bxs-edit'
    },
    {
      item: this.deleteLabel,
      icon: 'bx bx-trash'
    },
  ]
  risksTypes: any;

  constructor(private popupService: PopupService,
    private projectsService: ProjectsService,
    private confirmationModalService: ConfirmModalService,
    private translateService: TranslateService,
    private attachmentService: AtachmentService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.data?.currentValue) {
      this.data.risks.forEach(element => {
        element["riskRate"] = this.getRiskRate(element.likelihood.title.en, element.impact.title.en)
      });
    }
  }

  ngOnInit() {
    this.handleLangChange();
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
      this.deleteLabel = this.translateService.instant('shared.delete');
      this.editLabel = this.translateService.instant('shared.edit');
      this.riskDropdownOptions = [
        {
          item: this.editLabel,
          icon: 'bx bxs-edit'
        },
        {
          item: this.deleteLabel,
          icon: 'bx bx-trash'
        },
      ]
    });
  }

  onAddRisk() {
    this.popupService.open('project')
    this.projectsService.savepopupConfig({
      title: {
        en: 'New Risk',
        ar: 'خطر جديد',
      },
      mode: 'risk',
      project: this.data
    })
  }


  onRiskOptionSelect(e, risk) {
    if (e === this.editLabel) {
      this.popupService.open('project')
      this.projectsService.savepopupConfig({
        title: {
          en: 'Edit Risk',
          ar: 'تعديل الخطر',
        },
        mode: 'risk',
        project: this.data,
        riskToUpdate: risk
      })
    }

    if (e === this.deleteLabel) {
      this.confirmationModalService.open();
      this.projectsService.saveConfirmationPopupConfig({
        text: this.translateService.instant('projects.deleteRiskConfirmationMsg'),
        btnText: this.deleteLabel,
        riskId: risk.id,
        mode: "risk"
      })
    }
  }

  getRiskRate(likelihood, impact) {
    const likelihoodSum = this.likelihoods.findIndex(item => item.title.en === likelihood) + 1
    const impactSum = this.impacts.findIndex(item => item.title.en === impact) + 1
    if (likelihoodSum + impactSum <= 4) {
      return this.translateService.instant('projects.low');
    }
    if (likelihoodSum + impactSum <= 6) {
      return this.translateService.instant('projects.medium');
    }
    if (likelihoodSum + impactSum <= 8) {
      return this.translateService.instant('projects.high');
    }
    if (likelihoodSum + impactSum <= 10) {
      return this.translateService.instant('projects.veryHigh');
    }

    return null
  }

  // if (likelihoodIndex + impactIndex <= 4) {
  //   this.riskForm.controls.riskRate.setValue("Low")
  //   return
  // }
  // if (likelihoodIndex + impactIndex <= 6) {
  //   this.riskForm.controls.riskRate.setValue("Medium")
  //   return
  // }
  // if (likelihoodIndex + impactIndex <= 8) {
  //   this.riskForm.controls.riskRate.setValue("High")
  //   return
  // }
  // if (likelihoodIndex + impactIndex <= 10) {
  //   this.riskForm.controls.riskRate.setValue("Very High")
  //   return
  // }

  openFile(filename) {
    this.attachmentService.getAttachmentURLs(filename).subscribe(res => {
      window.open(res[0].fileUrl, "_blank");
    })
  }

}
