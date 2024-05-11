import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { IdeasService } from '../../services/ideas.service';

@Component({
  selector: 'app-ideas-modal',
  templateUrl: './ideas-modal.component.html',
  styleUrls: ['./ideas-modal.component.scss']
})
export class IdeasModalComponent implements OnInit {
  config: any
  ideaForm: FormGroup
  isBtnLoading: boolean
  @Output() refreshParentComponent: EventEmitter<any> = new EventEmitter();

  constructor(private ideasService: IdeasService,
    private popupService: PopupService,
    private toastr: ToastrService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.ideasService.modalConfigModal.subscribe(res => {
      if (res) {
        this.config = res
        if (res.mode === 'idea-form') {
          this.initIdeaForm()
        }
      }
    })
  }

  initIdeaForm() {
    this.ideaForm = this.fb.group({
      title: [null, Validators.required],
      description: [null, Validators.required],
      category: [null, Validators.required]
    })
  }



  onCancelPopup() {
    this.popupService.close()
  }

  onRegisterIdea() {
    if (this.ideaForm.valid) {
      this.isBtnLoading = true
      this.ideasService.registerIdea(this.ideaForm.value).subscribe(res => {
        this.popupService.close()
        this.refreshParentComponent.emit()
        this.ideaForm.reset()
        this.toastr.success("Idea was successfully registred")
        this.isBtnLoading = false
      })

    }
  }

}
