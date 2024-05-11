import { Component, Input, OnInit } from '@angular/core';
import { InitialsService } from './initials.service';

@Component({
  selector: 'app-initials',
  templateUrl: './initials.component.html',
  styleUrls: ['./initials.component.scss']
})
export class InitialsComponent implements OnInit {
  @Input() name: string
  @Input() dimensions: any
  colors: any = ['#8D29C4', "#E15A97", "#4B2840", "#2A2A72", "#FFA400"]
  randomNumber: number;
  constructor(private initialsService: InitialsService) { }

  ngOnInit() {
    this.randomNumber = this.generateRandomInteger(0, 4)
  }

  generateRandomInteger(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1))
  }



}
