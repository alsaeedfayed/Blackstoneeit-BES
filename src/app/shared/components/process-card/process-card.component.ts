import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-process-card',
  templateUrl: './process-card.component.html',
  styleUrls: ['./process-card.component.scss']
})
export class ProcessCardComponent implements OnInit, OnChanges {
  @Input() data;


  randomClasses = [
    'name-blue',
    'name-purple',
    'name-bluesky',
    'name-orange',
    'name-success',
    'name-purple-light',
    'name-navy-blue',
    'name-navy-color'
  ]
  randomClass;
  status: any;
  statesWithRandomColors: any = [];
  lang: string = this.translate.currentLang;


  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
    this.generateRandomClass(0, 7);
    this.handleLangChange()
  }

  private handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  ngOnChanges() {
    this.status = this.data.states.sort(this.dynamicSort('displayOrder'))
  }

  dynamicSort(property) {
    let sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      const result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }

  //random color for process card name top left badge
  generateRandomClass(min, max) {
    this.randomClass = this.randomClasses[Math.floor(Math.random() * (max - min + 1) + min)]
  }
}
