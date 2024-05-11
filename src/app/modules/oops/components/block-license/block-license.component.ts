import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
    selector: 'block-license',
    templateUrl: './block-license.component.html',
    styleUrls: ['./block-license.component.scss'],
})

export class BlockLicenseComponent extends ComponentBase implements OnInit {

    language: string = this.translate.currentLang;

    constructor(private router: Router, private userService: UserService, translateService: TranslateConfigService, translate: TranslateService) {
        super(translateService, translate);
    }

    ngOnInit(): void {}

    goToLogin() {
        this.userService.clear();
        this.router.navigate(['/login']);
    }

}
