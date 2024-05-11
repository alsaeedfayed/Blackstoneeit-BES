import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren, OnChanges } from '@angular/core';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { TranslationService } from 'src/app/core/services/translate.service';

@Component({
  selector: 'app-team-search',
  templateUrl: './team-search.component.html',
  styleUrls: ['./team-search.component.scss']
})
export class TeamSearchComponent implements OnInit {

  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;
  _users;
  @Input()
  public set users(v: any[]) {
    this._users = v;
    this.selectedMembers = this._users.filter(u => u.checked);
  }
  @Input() memberToAddType;
  @Input() lang: string;
  @Input() title: string;
  @Input() isRowClass: boolean = false;
  @Input() isRequired: boolean = false;

  @Output() onUserSelect = new EventEmitter();

  selectedMembers: any = []
  query;

  constructor(private translationService: TranslateConfigService) { }

  ngOnInit() {
    this.lang = this.translationService.getSystemLang()
  }

  onSelect(e, member) {
    if (e.target.checked) {
      this.selectedMembers.push(member)
    } else {
      this.selectedMembers = this.selectedMembers.filter(item => item.id !== member.id)
    }

    this.onUserSelect.emit(this.selectedMembers);
  }

  uncheckAll() {
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });
  }

  randomNo(i) {
    return i % 5;
  }

}
