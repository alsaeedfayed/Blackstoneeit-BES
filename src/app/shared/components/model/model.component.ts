import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModelService } from './model.service';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss'],
})
export class ModelComponent implements OnInit {

  @Input() hasBackBtn = true;
  @Input() hasTitle = true;
  @Input() title: string = '';
  @Input() dimensions: any;
  @Input() id: any;
  @Input() isNewModel: any;

  @Output() close = new EventEmitter();

  constructor(public modelService: ModelService) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this.closePopup();
  }

  closeModelOnBackdropClick() {
    this.modelService.closeModel$.next();
    this.closePopup();
  }

  closePopup() {
    this.modelService.close();
    this.close.emit();
  }
}
