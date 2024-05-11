import { IScorecard } from './../interfaces/mange-scorecards.interface';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { ModelService } from 'src/app/shared/components/model/model.service';

@Component({
  selector: 'app-mange-scorecard-page',
  templateUrl: './mange-scorecard-page.component.html',
  styleUrls: ['./mange-scorecard-page.component.scss']
})
export class MangeScorecardPageComponent extends ComponentBase implements OnInit {
  public isShowForm: boolean = false;
  public loading: boolean = false;
  public scorecards: IScorecard[] = [];
  public filteredScorecards: IScorecard[] = [];
  public searchKey: string = "";

  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private httpHandlerService: HttpHandlerService,
    private modelService: ModelService,
  ) {
    super(translateService, translate);
  }

  ngOnInit(): void {
    this.getScorecardsData();
  }

  handleSearchValueFilter(keyword: string): void {
    this.searchKey = keyword;
    this.filteredScorecards = this.scorecards.filter(
      (service) =>
        service.title
          .toLocaleLowerCase()
          .includes(keyword.toLocaleLowerCase()) ||
        service.titleAr
          .toLocaleLowerCase()
          .includes(keyword.toLocaleLowerCase())
    );
  }

  openPopup() {
    this.isShowForm = true;
    this.modelService.open('new-scorecard');
  }

  closePopup() {
    this.isShowForm = false;
    this.modelService.close();
  }

  chnageCurrentScorecardHandler(scorecard: IScorecard) {
    // const ChangedScorecard = this.scorecards.find((scorecardItem:IScorecard)=> scorecardItem.id == scorecard.id) || null;
    // if (ChangedScorecard) {
    //   if (!ChangedScorecard.current) {
    //     this.scorecards = this.scorecards.map((scorecard)=> {
    //       return scorecard.id != ChangedScorecard.id ? {
    //         ...scorecard,
    //         current: false
    //       } :  {...scorecard}
    //     })
    //   }
    // }
    if (!scorecard.current) {
      this.scorecards.forEach((scorecard) => scorecard.current = false)
      // console.log(this.scorecards)
      this.filteredScorecards.forEach((scorecard) => scorecard.current = false)
      //console.log(this.filteredScorecards)
    }
  }

  changeHandler() {
    this.getScorecardsData();
  }

  getScorecardsData() {
    this.loading = true;

    this.httpHandlerService
      .get(Config.MangeScorecards.getAll)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.scorecards = res;
        this.filteredScorecards = res;
      });
  }

}
