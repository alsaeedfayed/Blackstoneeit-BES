import { INotification } from './../../../layout/Interfaces/interfaces';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'notification-item',
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.scss']
})
export class NotificationItemComponent implements OnInit {
  // INPUTS & OUTPUTS
  @Input() notification:INotification;
  @Output() notificationReaded:EventEmitter<INotification> = new EventEmitter()
  notificationPerson = {
    name: 'Muhammad Tarek',
    image: '',
    backgroundColor: '#0075FF',
    isActive: true,
    position: '',
  };
  constructor() { }

  ngOnInit(): void {
  }

  public readNotificationHandler(){
    this.notification.isRead = true;
    this.notificationReaded.emit(this.notification)
  }

}
