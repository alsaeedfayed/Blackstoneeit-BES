import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Component({
    selector: 'control-dynamic-table',
    templateUrl: './control-dynamic-table.component.html',
    styleUrls: ['./control-dynamic-table.component.scss'],
})

export class ControlDynamicTableComponent implements OnInit {

    @Input() columns = [];
    @Input() rows = [];
    @Input() showIndex: boolean = true;
    @Input() showActions: boolean = true;

    @Output() itemDeletedHandler:EventEmitter<any> = new EventEmitter()

    destroy$: Subject<unknown> = new Subject();
    public lang = this.translateService.currentLang;
    private endSub$ = new Subject()

    constructor(private translateService:TranslateService) {}

    ngOnInit(): void {
        this.handleLangChange();
    }

    handleLangChange() {
        this.translateService.onLangChange.subscribe((language) => {
        this.lang = this.translateService.currentLang;
        });
    }

    deleteRow(id) {
        let indx = this.rows.findIndex(obj => obj.id == id);
        this.rows.splice(indx, 1);
        this.itemDeletedHandler.emit(this.rows);
    }

}
