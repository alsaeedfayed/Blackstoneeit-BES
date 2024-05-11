
import { EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { INode } from '../node';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'chart-designer',
  templateUrl: './chart-designer.component.html',
  styleUrls: ['./chart-designer.component.scss']
})
export class ChartDesignerComponent implements OnInit {
  @Input() node: INode;

  @Input() hasParent = false;

  @Input() direction: 'vertical' | 'horizontal' = 'vertical';

  @HostBinding('style.flex-direction')
  get hostClass() {
    return this.direction === 'vertical' ? 'column' : '';
  }

  constructor() { }

  ngOnInit(): void { }

}
