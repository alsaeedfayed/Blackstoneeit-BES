

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/core/services/user.service';
import { ProjectCommentsService } from './services/project-comments.service';

@Component({
  selector: 'app-project-comments-list',
  templateUrl: './project-comments-list.component.html',
  styleUrls: ['./project-comments-list.component.scss']
})
export class ProjectCommentsListComponent implements OnInit {
  projectId: string;
  comments: any;
  comment = new FormControl(null, Validators.required)
  lang: string;
  currentUserData: any;
  isBtnLoading: boolean

  @ViewChild('commentsContainer') private commentsContainer: ElementRef;

  constructor(private translateService: TranslateService,
    private projectCommentsService: ProjectCommentsService,
    private userService: UserService,
    private toastr: ToastrService,
    private route: ActivatedRoute,) { }

  ngOnInit() {
    this.lang = this.translateService.currentLang;
    this.handleLangChange();
    this.route.paramMap.subscribe(paramMap => {
      this.projectId = paramMap.get('id')
    })
    this.getProjectComments(this.projectId)
    this.currentUserData = this.userService.getCurrentUserData()
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  scrollCommentContainerToBottom() {
    this.commentsContainer.nativeElement.scrollTop = this.commentsContainer.nativeElement.scrollHeight
  }


  getProjectComments(id) {
    this.projectCommentsService.getProjectComments(id).subscribe(res => {
      res.map(element => {
        element['timeAgo'] = moment(this.convertUTCDateToLocalDate(element?.createdDate).toLocaleString()).fromNow()
      });
      this.comments = res
    })
  }

   // Convert UTC Date To LocalDate
   public convertUTCDateToLocalDate(date: any) {
    let lastDate = new Date(date)
    var newDate = new Date(
      lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000
    );
    return newDate;
  }
  

  onAddComment() {
    if (this.comment.valid) {
      this.isBtnLoading = true
      const newComment = {
        "projectId": this.projectId,
        "text": this.comment.value
      }
      this.projectCommentsService.createComment(newComment).subscribe(res => {
        this.getProjectComments(this.projectId)
        this.comment.reset()
        this.scrollCommentContainerToBottom()
        this.isBtnLoading = false
      }, err => {
        this.isBtnLoading = false
        this.toastr.error(err.message[this.lang])
      })
    }
  }

  toggleLikeBtn(id) {
    this.projectCommentsService.toogleCommentLike(id).subscribe(res => {
      this.getProjectComments(this.projectId)
    })
  }

}
