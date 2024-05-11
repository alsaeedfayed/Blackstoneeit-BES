import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-filter-dropdown',
  templateUrl: './filter-dropdown.component.html',
  styleUrls: ['./filter-dropdown.component.scss'],
})
export class FilterDropdownComponent implements OnInit, OnChanges {
  @Input() title: string;
  @Input() items: any;
  @Input() width: number = 165;
  @Input() isDepartmentsChart: boolean;
  @Input() disabled: boolean;
  @Input() selectedItemValue;
  @Input() selectedItemId;
  isOpened: boolean;
  selectedItem;
  // selectedItem: any = {
  //   title: {
  //     en: 'All',
  //     ar: 'الكل',
  //   },
  // };
  lang: string;
  @ViewChild('toggleButton') toggleButton: ElementRef;
  @ViewChild('dropdown') dropdown: ElementRef;
  @Output() selectEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    private renderer: Renderer2,
    private translateService: TranslateService
  ) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (
        e.target !== this.toggleButton.nativeElement &&
        e.target !== this.dropdown.nativeElement
      ) {
        this.isOpened = false;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.items) {
      this.selectedItem = this.items.find((item) => item.isDefault)
        ? this.items.find((item) => item.isDefault)
        : {
            title: {
              en: 'All',
              ar: 'الكل',
            },
          };
    }

    if(this.selectedItemValue && this.items){
      this.selectedItem = this.items.filter((item) => item.title.ar == this.selectedItemValue || item.title.en == this.selectedItemValue).length > 0
        ? this.items.filter((item) => item.title.ar == this.selectedItemValue || item.title.en == this.selectedItemValue)[0]
        : {
            title: {
              en: 'All',
              ar: 'الكل',
            },
          };
    }

    if(this.selectedItemId && this.items){
      this.selectedItem = this.items.filter((item) => item.id == this.selectedItemId).length > 0
        ? this.items.filter((item) => item.id == this.selectedItemId)[0]
        : {
            title: {
              en: 'All',
              ar: 'الكل',
            },
          };
    }

    if (this.isDepartmentsChart && this.items) {
      this.onSelect(this.items[0]);
    }
  }

  ngOnInit() {
    this.lang = this.translateService.currentLang;
    this.handleLangChange();
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  onSelect(event) {
    this.selectEvent.emit(event);
    this.isOpened = false;
    this.selectedItem = event;
  }
}
