import {Component, Input, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {ComponentBase} from "src/app/core/helpers/component-base.directive";
import {HttpHandlerService} from "src/app/core/services/http-handler.service";
import {TranslateConfigService} from "src/app/core/services/translate-config.service";
import {UserService} from "src/app/core/services/user.service";
import {ModelService} from "src/app/shared/components/model/model.service";
import {ExportFilesService} from "src/app/shared/services/export-files/export-files.service";
import {Challenge} from "../../models/challenge";
import {Statues} from "../../models/statues";

@Component({
  selector: 'app-challenge-card',
  templateUrl: './challenge-card.component.html',
  styleUrls: ['./challenge-card.component.scss']
})
export class ChallengeCardComponent extends ComponentBase implements OnInit {
  @Input() challenge: Challenge;

  language: string = this.translate.currentLang;
  Statues: any = new Statues();


  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private httpSer: HttpHandlerService,
    private router: Router,
    private userSer: UserService,
    private modelService: ModelService,
    private exportFilesService: ExportFilesService
  ) {
    super(translateService, translate);
  }

  ngOnInit(): void {
    console.log(this.challenge)
  }


}
