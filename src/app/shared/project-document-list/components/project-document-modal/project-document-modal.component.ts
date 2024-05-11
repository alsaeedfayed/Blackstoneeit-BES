import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/core/services/user.service';
import { ProjectsService } from 'src/app/modules/projects/services/projects.service';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { ProjectDocumentsService } from '../../services/project-documents.service';

@Component({
  selector: 'app-project-document-modal',
  templateUrl: './project-document-modal.component.html',
  styleUrls: ['./project-document-modal.component.scss']
})
export class ProjectDocumentModalComponent implements OnInit {
  @Input() popupConfig
  @Input() projectId
  @Input() saveInMemory
  description = new FormControl(null, Validators.required)
  lang: string;
  uploadedfile: any
  isFormSubmitted: boolean
  @Output() refreshParentComponent: EventEmitter<any> = new EventEmitter();
  @Output() onSaveInMemory: EventEmitter<any> = new EventEmitter();
  uploadedFileInfo: any;
  constructor(private popupService: PopupService,
    private translateService: TranslateService,
    private projectsService: ProjectsService,
    private projectsDocumentsService: ProjectDocumentsService,
    private toastr: ToastrService,
    private userService: UserService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.lang = this.translateService.currentLang;
    this.handleLangChange();
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  onPopupClose() {
    this.popupService.close()
  }

  onFileChange(e) {
    this.uploadedfile = {
      data: e.target.files[0],
      title: e.target.files[0].name,
    }
    this.onUploadFile(e.target.files[0])
  }


  onUploadFile(file) {
    this.projectsDocumentsService.onUploadAttachment(file).subscribe((res: any) => {
      this.uploadedFileInfo = {
        title: file.name,
        extension: file.name.split('.').pop(),
        fileName: res.fileName,
        uploadedFileName: file.name
      }
    }, err => {
    })
  }

  convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((<string>reader.result).split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  }


  onSaveFile() {
    this.isFormSubmitted = true
    if (this.description.valid && this.uploadedfile) {
      if (this.saveInMemory) {
        this.onSaveInMemory.emit({
          attachment: {
            fileName: this.uploadedFileInfo.fileName,
            extension: this.uploadedFileInfo.extension,
            uploadedFileName: this.uploadedFileInfo.uploadedFileName
          },
          description: this.description.value,
          uploadedDate: new Date(),
          uploadedBy: {
            name: { en: this.userService.getCurrentUserData().userName, ar: this.userService.getCurrentUserData().userName },
            position: ''
          }
        })
        this.popupService.close()
        this.isFormSubmitted = false
        this.description.reset()
        this.uploadedfile = null
      } else {
        this.projectsService.saveLoadingModalState(true)
        this.popupService.close()
        const newDocument = {
          "projectId": this.projectId,
          "attachment": {
            "fileName": this.uploadedFileInfo.fileName,
            "extension": this.uploadedFileInfo.extension,
            uploadedFileName: this.uploadedFileInfo.uploadedFileName
          },
          "description": this.description.value
        }

        this.projectsDocumentsService.addDocument(newDocument).subscribe(res => {
          this.toastr.success(this.translateService.instant("shared.documentWasSuccessfullyAdded"))
          this.refreshParentComponent.emit()
          this.isFormSubmitted = false
          this.description.reset()
          this.uploadedfile = null
          this.projectsService.saveLoadingModalState(false)
        })
      }

    }
  }

  onDeleteFile() {
    this.uploadedfile = null
  }



}
