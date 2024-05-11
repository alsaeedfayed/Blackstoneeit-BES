import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-projects-card',
  templateUrl: './projects-card.component.html',
  styleUrls: ['./projects-card.component.scss']
})
export class ProjectsCardComponent implements OnInit {
  projectData;
  @Input()
  public set _projectData(v: any) {
    v.manager = { ...v.manager, fullName: v.manager.fullname, fileName: v.manager.profileImage, userName: v.manager.email };
    this.projectData = v;
  }

  @Input() index;
  cardActions: any = [
    {
      item: 'Delete',
      disabled: false,
      textColor: '',
      icon: ''
    },
    {
      item: 'Update',
      disabled: false,
      textColor: '',
      icon: ''
    }
  ]
  lang: string;
  progressLabel: string = this.translateService.instant('projects.progress');

  constructor(private translateService: TranslateService) { }

  ngOnInit() {
    this.lang = this.translateService.currentLang;
    this.handleLangChange();
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
      this.progressLabel = this.translateService.instant('projects.progress');
    });
  }

  onDropdownSelect(e) {

  }

}
