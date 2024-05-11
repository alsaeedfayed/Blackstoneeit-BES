import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss']
})
export class StateComponent implements OnInit {
  @Input() label: string;
  color: string;

  constructor() { }

  ngOnInit(): void {
    this.color = this.getColor(this.label);
  }

  getColor(label: string) {
    const state = label.toLowerCase();
    switch (state) {
      case 'completed':
      case 'done':
      case 'open':

        return 'success';
        break;

      case 'pending':
        return 'warning';
        break;

      case 'in progress':
        return 'primary';
        break;

      case 'to do':
        return 'purple';
        break;

      default:
        return 'review';
        break;
    }
  }
}
