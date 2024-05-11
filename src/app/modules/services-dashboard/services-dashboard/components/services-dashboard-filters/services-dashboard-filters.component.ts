import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

@Component({
  selector: 'app-services-dashboard-filters',
  templateUrl: './services-dashboard-filters.component.html',
  styleUrls: ['./services-dashboard-filters.component.scss'],
})
export class ServicesDashboardFiltersComponent implements OnInit {
  //TODO VARIABLES
  lang: string = ''
  status = [
    {
      id: 1,
      name: 'مفتوحة',
      nameEn: 'Open',
    },
    {
      id: 2,
      name: 'مغلقة',
      nameEn: 'Closed',
    },
  ]

  filterValues: any = {}

  @Input() OnlyShowForServicesAndRequests: boolean
  @Output() filter: EventEmitter<any> = new EventEmitter()

  constructor() {}

  ngOnInit(): void {}

  //TODO Actions

  changeFilter() {
    this.filter.emit(this.filterValues)
  }
}
