import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'vote-percentage',
  templateUrl: './vote-percentage.component.html',
  styleUrls: ['./vote-percentage.component.scss']
})
export class VotePercentageComponent implements OnInit {

  @Input() yesPercentage: number;
  @Input() noPercentage: number;
  @Input() color: string;
  @Input() isReadonly = true;

  @Output() votedYes = new EventEmitter();
  @Output() votedNo = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onVotedYes(): void {
    !this.isReadonly && this.votedYes.emit();
  }

  onVotedNo(): void {
    !this.isReadonly && this.votedNo.emit();
  }

}
