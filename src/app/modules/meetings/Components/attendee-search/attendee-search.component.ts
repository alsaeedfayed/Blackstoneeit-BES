import { Component, ElementRef, Input, OnInit, Output, QueryList, ViewChildren, EventEmitter } from '@angular/core';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';

@Component({
  selector: 'app-attendee-search',
  templateUrl: './attendee-search.component.html',
  styleUrls: ['./attendee-search.component.scss']
})
export class AttendeeSearchComponent implements OnInit {
  @Input() users;
  @Input() memberToAddType;
  @Input() lang: string;
  selectedMembers: any = []
  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;
  query;
  @Input() attendeesPoitions = [];
  @Output() selectedUsers = new EventEmitter();
  @Output() onSearch = new EventEmitter();

  constructor(private translationService: TranslateConfigService) { }

  ngOnInit() {
    this.lang = this.translationService.getSystemLang()
    this.selectedMembers = this.users.filter(item => item.checked);
  }

  onSelect(e, member) {
    if(!member.disabled){
      member.checked = !member.checked;
      member.attended = true;
      if (member.checked) {
        this.selectedMembers.push(member);
      } else {
        member.attended = false;
        this.selectedMembers = this.selectedMembers.filter(item => item.id !== member.id);
      }
      this.selectedUsers.emit(this.selectedMembers);
    }
  }

  onSelectRole(e, member){
    member.role = e;
  }

  onAttend(e, member){
    if(!member.disabled){
      member.attended = !member.attended;
      if(member.attended){
        member.checked = true;
        if(this.selectedMembers.findIndex(item => {item.id == member.id}) == -1){
          this.selectedMembers.push(member);
        }
      }
      this.selectedUsers.emit(this.selectedMembers);
    }
  }

  uncheckAll() {
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });
  }

  randomNo(i) {
    return i % 5;
  }

  search(value) {
    this.onSearch.emit(value);
  }

}
