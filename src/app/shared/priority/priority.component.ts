import { Component, Input, OnInit } from '@angular/core';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';

@Component({
  selector: 'app-priority',
  templateUrl: './priority.component.html',
  styleUrls: ['./priority.component.scss']
})
export class PriorityComponent implements OnInit {
  @Input() priority: string
  @Input() lang: string
  criteriaOptions = [
    {
      title: "Low",
      titleAr: "منخفضة",
      id: "1",
      color: "#FBC103"
    },
    {
      title: "Medium",
      titleAr: "متوسطة",
      id: "2",
      color: "#FF6E5A"
    },
    {
      title: "High",
      titleAr: "عالية",
      id: "3",
      color: "#FF285C"
    },
  ]
  constructor(private translationConfigService: TranslateConfigService) { }

  ngOnInit() {
  }

}
