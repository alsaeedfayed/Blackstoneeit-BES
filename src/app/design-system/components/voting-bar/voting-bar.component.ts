import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-voting-bar',
  templateUrl: './voting-bar.component.html',
  styleUrls: ['./voting-bar.component.scss']
})
export class VotingBarComponent implements OnInit {
  @Input() vote: any = null;
  @Input() language: string = '';
  constructor() { }

  ngOnInit(): void {
  }

}
