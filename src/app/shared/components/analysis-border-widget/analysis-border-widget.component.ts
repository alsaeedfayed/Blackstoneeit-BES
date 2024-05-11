import { Component, Input } from "@angular/core";
import { IBorderWidget } from "./iBorderWidget.interface";

@Component({
    selector: 'analysis-border-widget',
    templateUrl: './analysis-border-widget.component.html',
    styleUrls: ['./analysis-border-widget.component.scss']
})

export class AnalysisBorderWidgetComponent {

    data: IBorderWidget = {} as IBorderWidget;
    @Input() set Data(data: IBorderWidget) {
        this.data = data;
    }
    
}