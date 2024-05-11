import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';

@Component({
  selector: 'app-main-tasks-filters',
  templateUrl: './main-tasks-filters.component.html',
  styleUrls: ['./main-tasks-filters.component.scss']
})
export class MainTasksFiltersComponent implements OnInit {

  @Output() filter: EventEmitter<any> = new EventEmitter();
  @Input() committeeId: number = 0;
  @Input() language: string = '';

  form: FormGroup;
  workGroups: any[] = [];
  filterValues: any = {};



  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private httpSer: HttpHandlerService
  ) { }

  ngOnInit(): void {


    // initialize filter form controls
    this.initFilterFormControls();

    // get all committee work Groups
    this.getAllWorkGroups();
  }


  // initialize filter form controls
  initFilterFormControls() {
    this.form = this.fb.group({
      workgroupId: this.fb.control(null),
    });
  }

  // fetch all work groups
  private getAllWorkGroups() {

    // send a request to fetch work groups
    this.httpSer
      .get(`${Config.WorkGroup.GetAllByCommitteeId}/${this.committeeId}`)
      .subscribe((res) => {
        if (res) {
          // all items list
          this.workGroups = res?.workgroups?.data;
        }
      });
  }
  // emit filter values
  public updateFilter() {
    this.filter.emit(this.filterValues);
    let filterCounts = Object.values(this.filterValues).filter(v => v != null).length;
  }

  // change filter values
  changeFilter() {
    this.filterValues = {
      ...this.filterValues,
      ...this.form.value,
    };
    this.updateFilter();
  }

}
