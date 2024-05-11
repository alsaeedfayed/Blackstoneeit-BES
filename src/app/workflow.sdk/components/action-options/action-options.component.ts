import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ModelService } from '../workflow-model/model.service';
import { IOption } from '../../interfaces/iOption.interface';
import { ITask } from '../../interfaces/iTask.interface';

@Component({
  selector: 'workflow-action-options',
  templateUrl: './action-options.component.html',
  styleUrls: ['./action-options.component.scss']
})
export class ActionOptionsComponent implements OnInit {

  lang: string = this.translate.currentLang;

  public isPopupOpen: boolean = false;
  selectedOpt: any;

  @Input() title: string;
  @Input() task: ITask;
  @Input() options: IOption[] = [];
  @Input() instanceId: number;

  @Output() onSaveAction = new EventEmitter();
  @Output() onActionClicked = new EventEmitter();

  constructor(
    public translate: TranslateService,
    private modalService: ModelService,
  ) { }

  ngOnInit(): void {
    this.handleLangChange();
  }

  private handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  openActionModel(option) {
    this.onActionClicked.emit(option);
    this.isPopupOpen = true;
    this.selectedOpt = option;
    this.modalService.open('workflow-action-model' + option?.id);
  }

  actionSaveHandler() {
    this.onSaveAction.emit();
  }

  @Output() onFormBuilderValuesChange = new EventEmitter<any>();
  getBuildedFormValues(value) {
    this.onFormBuilderValuesChange.emit(value);
  }
}
