import { Component, Input, OnInit } from '@angular/core';
import { RoleCoverage } from '../../models/bau-dashboard';

@Component({
  selector: 'app-roles-coverages',
  templateUrl: './roles-coverages.component.html',
  styleUrls: ['./roles-coverages.component.scss']
})
export class RolesCoveragesComponent implements OnInit {

  //TODO VARIABLES
  @Input() language : string
  @Input() rolesCoverage : RoleCoverage[]

  constructor() { }

  ngOnInit(): void {
  }

}
