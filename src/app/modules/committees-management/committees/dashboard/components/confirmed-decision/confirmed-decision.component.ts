import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ImageService } from 'src/app/shared/PersonItem/image.service';

@Component({
  selector: 'app-confirmed-decision',
  templateUrl: './confirmed-decision.component.html',
  styleUrls: ['./confirmed-decision.component.scss']
})
export class ConfirmedDecisionComponent implements OnInit {

  @Input() language: string;
  @Input() committeeId = 0;

  loadingDecisions: boolean = true;
  decisions: any[] = [];

  constructor(
    private translateService: TranslateService,
    private router: Router,
    private imageService: ImageService,
    private httpSer: HttpHandlerService,
  ) { }

  ngOnInit(): void {

    this.handleLangChange();
    this.getLatestFourDecisions();
  }
  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.language = language.lang;

    });
  }
  getLatestFourDecisions() {
    this.httpSer
      .get(
        `${Config.CommitteeDashboard.GetLatestFourDecisions}/${this.committeeId}`
      )
      .pipe(
        finalize(() => { this.loadingDecisions = false; })
      )
      .subscribe(res => {
        if (res) {
          this.decisions = res;
          this.decisions.forEach((decision: any) => {
            if (decision.votersInfo) {
              decision.yesPercentage = (decision.yesCount / decision.votersCount) * 100;
              decision.votersInfo.forEach(member => {
                if (member.fileName?.length > 0) {
                  member.image = null;
                  this.imageService
                    .setFileURL(member.fileName)
                    .subscribe(imgUrl => {
                      // add member image to the member object
                      member.image = imgUrl[0]?.fileUrl;
                    });
                }
              });
            }
          });
        }
      });
  }
  goToDecisions() {
    let path = `/committees-management/committee-details/${this.committeeId}/decisions`;
    this.router.navigateByUrl(path);
  }


}
