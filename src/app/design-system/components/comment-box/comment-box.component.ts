import { Component, Input, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.scss']
})
export class CommentBoxComponent implements OnInit, OnDestroy {

  @Input() comments = [];
  @Input() language: string = '';
  @Input() doesDateHasOffset: boolean = false;

  @Input()
  public set selectedComment(v: any) {
    if (v) {
      setTimeout(() => {

        let element = this.el.nativeElement.querySelector('#comment-' + v);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
          // element.style.border = '1px solid gray';
          element.classList.add('selected');
        }
      })

    }

  }

  userId: string = '';
  constructor(
    private userService: UserService,
    private el: ElementRef,
  ) { }
  ngOnDestroy(): void {
  }
  ngOnInit(): void {
    this.userId = this.userService.getCurrentUserId();

    // TODO remove it after fix the user card
    this.comments.map((comment) => {
      if (comment.creatorInfo)
        comment.creatorInfo = {
          ...comment.creatorInfo,
          fullArabicName: comment.creatorInfo.fullName
        }
    });
  }

}
