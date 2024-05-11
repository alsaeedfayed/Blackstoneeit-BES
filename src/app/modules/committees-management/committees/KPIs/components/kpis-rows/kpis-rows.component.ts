import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { MeasurementRecurrenceService } from 'src/app/modules/committees-management/requests/services/measurementRecurrence/measurement-recurrence.service';
import { MeasurementRecurrences } from 'src/app/modules/committees-management/requests/models/MeasurementRecurrences';
import { KPI } from 'src/app/modules/committees-management/requests/models/KPI';
import { RoutesVariables } from 'src/app/modules/committees-management/routes';

@Component({
  selector: 'app-kpis-rows',
  templateUrl: './kpis-rows.component.html',
  styleUrls: ['./kpis-rows.component.scss']
})
export class KpisRowsComponent implements OnInit {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;

  committeeId: number

  @Input() list = [];
  @Input() totalItems: number;

  @Input() paginationModel: any = {
    pageIndex: 1,
    pageSize: 30,
  };

  @Output() onPaginateEvent = new EventEmitter();

  measurementRecurrences: MeasurementRecurrences[] = null;
  measurementTypes  :any[] = []
  constructor(
    private translate: TranslateService,
    private router: Router,
    private measurementRecurrenceService: MeasurementRecurrenceService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // handles language change event
    this.handleLangChange();
    this.measurementRecurrences = this.measurementRecurrenceService.getMeasures();
    this.measurementTypes = this.measurementRecurrenceService.getMeasureTypes();
    this.committeeId = +this.activatedRoute.snapshot.parent.params['id'];
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });
  }

  // emit a pagination event to the parent component
  onPaginate(e) {
    this.onPaginateEvent.emit(e);
  }

  // go to meeting details page
  goToKpiDetails(id) {
    //'committees-management/committee-details/:committeeId/Kpi/:kpiId'
    let path = `/committees-management/${RoutesVariables.KPI.Details}`.replace(':committeeId', `${this.committeeId}`).replace(':kpiId', `${id}`)
    this.router.navigateByUrl(path);
  }
}
