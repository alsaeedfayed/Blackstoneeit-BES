import { PopupService } from './../../../../shared/popup/popup.service';
import { Component, Input } from '@angular/core';
import { PerformanceStatusMode } from '../../enum/enums';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'step',
  templateUrl: './planningStep.component.html',
  styleUrls: ['./planningStep.component.scss'],
})
export class PlanningStepComponent {
  @Input() stepName: string = '';
  @Input() items: any[] = [];
  @Input() planning: Array<any> = [];
  @Input() status: PerformanceStatusMode = PerformanceStatusMode.Approval;
  @Input() state;
  @Input() stepsCount: number = 0;
  @Input() IsActive: boolean = false;
  public user = JSON.parse(this.userSer.load("roles")).join(",");
  public position = this.userSer.load("position");

  constructor(private userSer: UserService, private popupService:PopupService) {

  }

  get isApproval() {
    return this.status === PerformanceStatusMode.Approval;
  }

  get isPlanning() {
    return this.status === PerformanceStatusMode.Planning;
  }

  get statusMsg():string{
    return this.state == 'Completed' && this.items.length === 0 ? "shared.completed" : "shared.noContent"
  }

  onClosePopup() {
    this.popupService.close()
  }



}
