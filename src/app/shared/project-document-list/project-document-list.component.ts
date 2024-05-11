import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AtachmentService } from 'src/app/core/services/atachment.service';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { ProjectsService } from 'src/app/modules/projects/services/projects.service';
import { ConfirmModalService } from '../confirm-modal/confirm-modal.service';
import { PopupService } from '../popup/popup.service';
import { ProjectDocumentsService } from './services/project-documents.service';

@Component({
  selector: 'app-project-document-list',
  templateUrl: './project-document-list.component.html',
  styleUrls: ['./project-document-list.component.scss']
})
export class ProjectDocumentListComponent implements OnInit, OnChanges {
  
  _projectStatus;
  @Input() projectId
  @Input() set projectStatus(projectStatus) {
    this._projectStatus = projectStatus;
  }
  @Input() saveInMemory
  documents = []
  popupConfig: any
  lang: string;
  filterItems: any = [
    {
      name: 'All',
      nameAr: 'الكل',
      isDefault: true
    },
    {
      name: 'Deliverables',
      nameAr: 'المخرجات',
      isDefault: false
    },
    {
      name: 'Invoices',
      nameAr: 'الفواتير',
      isDefault: false
    },
    {
      name: 'Risks',
      nameAr: 'المخاطر',
      isDefault: false
    },
    {
      name: 'Tasks',
      nameAr: 'المهام',
      isDefault: false
    },
    {
      name: 'Project Initiation',
      nameAr: 'بدء المشروع',
      isDefault: false
    },
    {
      name: 'Other',
      nameAr: 'آخر',
      isDefault: false
    },
  ]
  deleteLabel: string = this.translateService.instant('shared.delete');
  documentsDropdownOptions = [
    {
      item: this.deleteLabel
    }
  ]

  constructor(private projectsDocumentsService: ProjectDocumentsService,
    private translateService: TranslateService,
    private translateConfigService: TranslateConfigService,
    private confirmModalService: ConfirmModalService,
    private attachmentService: AtachmentService,
    private projectsService: ProjectsService,
    private popupService: PopupService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.projectId?.currentValue) {
      this.getProjectDocuments(this.projectId)
    }
  }

  ngOnInit() {
    this.lang = this.translateConfigService.getSystemLang();
    this.handleLangChange();
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
      this.deleteLabel = this.translateService.instant('shared.delete');
      this.documentsDropdownOptions = [
        {
          item: this.deleteLabel
        }
      ];
    });
  }

  get AllowAddDocument() {
    return this._projectStatus?.mappedStatusCode == 'ReturnedForCorrection' || this._projectStatus?.mappedStatusCode == 'Draft' || !this._projectStatus?.mappedStatusCode
  }

  getProjectDocuments(id, tag?) {
    this.projectsDocumentsService.getAllDocuments(id, tag).subscribe(res => {
      this.documents = res
    })
  }


  onAddDocument() {
    this.popupService.open('project')
    this.popupConfig = {
      title: {
        en: "Add Document",
        ar: "أضف مستند"
      }
    }
  }

  onSelectOption(e, documentId) {
    if (e === this.deleteLabel) {
      this.confirmModalService.open()
      this.projectsService.saveConfirmationPopupConfig({
        mode: "document",
        text: this.translateService.instant('shared.deleteDocumentConfirmationMsg'),
        documentId: documentId
      })
    }
  }

  onFilter(e) {
    if (e.name === 'All') {
      this.getProjectDocuments(this.projectId);

    } else {
      this.getProjectDocuments(this.projectId, e.name === 'Project Initiation' ? 'Initiation' : e.name);
    }
  }


  saveDocToMemory(e) {
    this.documents.push(e)
  }


  openFile(filename) {
    this.attachmentService.getAttachmentURLs(filename).subscribe(res => {
      window.open(res[0].fileUrl, "_blank");
    })
  }

}
