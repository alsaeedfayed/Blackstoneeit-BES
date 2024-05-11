import { Component, Input, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { Config } from "src/app/core/config/api.config";
import { ControlTypeMode } from "src/app/core/enums/control-type.enums";
import { HttpHandlerService } from "src/app/core/services/http-handler.service";
import { ConfirmModalService } from "src/app/shared/confirm-modal/confirm-modal.service";
import { CommentStatus } from "./enums";

@Component({
    selector: 'request-comments',
    templateUrl: './request-comments.component.html',
    styleUrls: ['./request-comments.component.scss'],
})

export class RequestCommentsComponent implements OnInit {
    
    controlTypeMode: any = ControlTypeMode;
    lang: string = this.translateService.currentLang;
    comment: FormControl = new FormControl();
    requestId: any;
    public confirmMsg: string;
    public item: any;
    @Input() set Item(item: any) {
        this.item = item;
        if(this.item?.comments?.length > 0)
            this.getComments();
    }

    constructor(
        private http: HttpHandlerService,
        private translateService: TranslateService,
        private activatedRoute: ActivatedRoute,
        private confirmationPopupService: ConfirmModalService,
        private toastSer: ToastrService
    ) {
        this.activatedRoute.params.subscribe((params) => {
            this.requestId = params['id']
        })
    }
    
    ngOnInit(): void {
        this.translateService.onLangChange.subscribe(lang => {
            this.lang = this.translateService.currentLang;
        })
    }

    getComments() {
        this.http.get(Config.requests.GetComments + this.requestId + '/'+ this.item.id).subscribe(res=> {
            this.item.comments = res.data;
        })
    }

    addComment() {
        let body = {
            requestId: this.requestId,
            fieldId: this.item.id,
            text: this.comment.value
        }
        this.http.post(Config.requests.AddComment, body).subscribe(res=> {
            if(res) {
                this.getComments();
                this.comment.setValue(null);
            }
        })
    }

    commentId: string;
    deleteComment(comment) {
        this.commentId = comment?.id;
        this.confirmMsg = `${this.translateService.instant('requests.deleteComment')} "${comment?.text}"?`;
        this.confirmationPopupService.open('delete-comment');
    }

    public onDeleteConfirmed() {
        this.confirmationPopupService.close('delete-comment');
        this.http.delete(Config.requests.DeleteComment + this.commentId).subscribe(res=> {
            if(res) {
                this.getComments();
                this.toastSer.success(this.translateService.instant('requests.deleteSuccessMsg'));
            }
        })
    }

    // Convert UTC Date To LocalDate
    public convertUTCDateToLocalDate(date: any) {
        let lastDate = new Date(date);
        var newDate = new Date(lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000);
        return newDate;
    }

    get CurrentUserId() {
        return localStorage.getItem('$EPPM$userId');
    }

    // approveComment() {
    //     this.item.status = CommentStatus.Approved;
    // }

    // rejectComment() {
    //     this.item.status = CommentStatus.Rejected;
    // }

}