import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {ComponentBase} from "src/app/core/helpers/component-base.directive";
import {HttpHandlerService} from "src/app/core/services/http-handler.service";
import {TranslateConfigService} from "src/app/core/services/translate-config.service";
import {UserService} from "src/app/core/services/user.service";
import {ModelService} from "src/app/shared/components/model/model.service";
import {ExportFilesService} from "src/app/shared/services/export-files/export-files.service";

@Component({
  selector: 'app-success-alert',
  templateUrl: './success-alert.component.html',
  styleUrls: ['./success-alert.component.scss']
})
export class SuccessAlertComponent extends ComponentBase implements OnInit {


  language: string = this.translate.currentLang;


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
    // Subscribe to language changes
    this.translate.onLangChange.subscribe((event) => {
      this.language = event.lang;
    });
  }

  ngOnInit(): void {
  }


}
