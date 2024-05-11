import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { TranslationService } from 'src/app/core/services/translate.service';

@Component({
  selector: 'workflow-team-search',
  templateUrl: './workflow-team-search.component.html',
  styleUrls: ['./workflow-team-search.component.scss']
})
export class WorkflowTeamSearchComponent implements OnInit {

  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;

  @Input() users;
  @Input() memberToAddType;
  @Input() lang: string;
  @Input() isRequired: boolean;

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
