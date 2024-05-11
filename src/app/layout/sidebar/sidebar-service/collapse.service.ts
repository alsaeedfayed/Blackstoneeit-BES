import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn :'root'
})
export class CollapseService {

    private isCollapse: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isCollapse$ = this.isCollapse.asObservable();

    setCollapseValue(flag: boolean) {
        this.isCollapse.next(flag);
    }

}