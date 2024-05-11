import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject, combineLatest } from 'rxjs';
import { finalize, take, pluck, takeUntil } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { IOption } from 'src/app/core/models/form-builder.interfaces';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { ITask } from 'src/app/modules/requests/components/request-details/iTask.interface';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { IchangeReauestDetails } from '../../interfaces/request.interface';
import { RequestsService } from '../../services/requests.service';

@Component({
  selector: 'app-chnage-request-detilas-page',
  templateUrl: './chnage-request-detilas-page.component.html',
  styleUrls: ['./chnage-request-detilas-page.component.scss'],
})
export class ChnageRequestDetilasPageComponent
  extends ComponentBase
  implements OnInit, OnDestroy
{
  private endSub$ = new Subject();
  /**************** Public Props ******************/
  public reqID: string = '';
  public instanceId: number;
  public isLoading: boolean = false;
  public status: any;
  public options: IOption[] = [];
  public tasks: ITask[] = [];
  public reqData: IchangeReauestDetails = {} as IchangeReauestDetails;
  public steps = [];
  public lang: string = this.translate.currentLang;
  public task = {};
  public isPopupOpen: boolean = false;
  selectedOpt: any;
  constructor(
    private httpHandlerService: HttpHandlerService,
    private activatedRoute: ActivatedRoute,
    private requestsService: RequestsService,
    translateService: TranslateConfigService,
    translate: TranslateService,
    private modalService: ModelService
  ) {
    super(translateService, translate);
    this.getCurrentId();
  }

  private getCurrentId() {
    this.activatedRoute.params
      .pipe(take(1), pluck('id'))
      .subscribe((id: string) => {
        this.reqID = id;
        this.getData();
      });
  }

  private getData() {
    this.isLoading = true;
    const status$ = this.httpHandlerService.get(
      `${Config.chnageRequest.GetStatus}/${this.reqID}`
    );
    const actions$ = this.httpHandlerService.get(
      `${Config.chnageRequest.GetActions}/${this.reqID}`
    );
    const details$ = this.httpHandlerService.get(
      `${Config.chnageRequest.GetDetails}/${this.reqID}`
    );
    combineLatest(status$, actions$, details$)
      .pipe(
        takeUntil(this.endSub$),
        finalize(() => (this.isLoading = false))
      )
      .subscribe(([status, actions, details]) => {
        this.steps = status && status.approvalInstance ? status.approvalInstance.states : null;
        this.options = actions && actions.options ? actions.options : [];
        this.reqData = details;
        this.instanceId = status?.approvalInstance?.instanceId;
      });
  }
  ngOnInit(): void {
    this.translate.onLangChange.subscribe((lang) => {
      this.lang = this.translate.currentLang;
    });
  }

  openActionModel(option) {
    this.isPopupOpen = true;
    this.selectedOpt = option;
    this.modalService.open('cr-action-model' + option?.id);
  }

  public actionTakenHandler() {
    setTimeout(() => {
      this.getData()
    }, 2000);
   }

  ngOnDestroy(): void {
    this.endSub$.next(null);
    this.endSub$.complete();
  }
}
