import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgxPermissionsService } from 'src/app/core/modules/permissions';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input() class: string = "btn btn-main";
  @Input() permission: number = 0;

  @Output() click = new EventEmitter();

  hasPermit: boolean = true;

  constructor(private permissionsService: NgxPermissionsService,
  ) { }

  ngOnInit(): void {
    this.hasPermit = !!this.permissionsService.getPermission(this.permission);
  }

  onClick() {
    this.click.emit();
  }

}
