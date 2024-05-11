import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-importance-level',
  templateUrl: './importance-level.component.html',
  styleUrls: ['./importance-level.component.scss']
})
export class ImportanceLevelComponent implements OnInit {
  @Input() title: string;
  @Input() selectedButton: number = null; // Default selected button value
  @Input() control: FormControl | undefined;


  lang: string = this.translateService.currentLang;

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    this.handleLangChange();
    this.updateFormControlValue();
  }

  handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  selectButton(button: number) {
    this.selectedButton = button;
    this.updateFormControlValue();
  }

  updateFormControlValue() {
    if (this.control) {
      this.control.setValue(this.selectedButton);
    }
  }
}

