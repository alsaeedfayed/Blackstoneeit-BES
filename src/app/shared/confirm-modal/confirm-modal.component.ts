import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from 'src/app/core/services/translate.service';
import { ConfirmModalService } from './confirm-modal.service';
declare let $: any;

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
})
export class ConfirmModalComponent implements OnInit, OnChanges {
  @Input() title: string;
  @Input() content: string;
  @Input() btnContent: string = 'Delete';
  @Input() btnStyle: string;
  @Input() id:string;
  @Input() showOkOnlyBtn: boolean = false;
  
  @Output() confirm = new EventEmitter();
  @Output() rejectionReason = new EventEmitter();
  @Output() cancel = new EventEmitter();
  reason;
  lang: string;

  constructor(
    private translationService: TranslationService,
    private router: Router
  ) { }

  ngOnChanges(changes: SimpleChanges): void { }

  ngOnInit(): void {
    this.lang = this.translationService.language;
  }

  modalconfirm() {
    this.confirm.emit(this.reason);
    $('#basicModalCenter').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }

  onCancel() {
    this.cancel.emit();
  }
}
