import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Output,
  HostListener,
  EventEmitter
} from '@angular/core';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';

@Component({
  selector: 'app-mention-box',
  templateUrl: './mention-box.component.html',
  styleUrls: ['./mention-box.component.scss']
})
export class MentionBoxComponent implements OnInit, AfterViewInit {

  @ViewChild('mentionBox') mentionBox: ElementRef;
  mentionBoxData: any = null;
  list: any[] = [];

  // @Input() placeholder: string = "";
  @Output() getComment = new EventEmitter<string>();
  @Input() set clearComment(value: boolean) {
    if (value) {
      this.mentionBoxData.innerHTML = ''
    }
  }
  //load users vars
  searchSubject = new Subject<string>();
  searchValue: string = '';
  itemsLoadCount: number = 1;

  //mentions search vars
  cursorPosition: number = 0;
  lastAtIndex: number = -1;

  //comment vars
  searchText: string = '';
  inputText: string = '';
  textWitUUIDs: string = '';
  showAutocomplete: boolean = false;
  mentionedUsers: any[] = [];

  //inside the input flag
  isInside: boolean = false;

  constructor(private httpSer: HttpHandlerService) {
    //search for items
    this.searchSubject.pipe(debounceTime(250)).subscribe((searchTerm: string) => {
      this.itemsLoadCount = 1;
      this.list = [];
      this.getUsers();
    });

  }

  ngOnInit(): void {
    this.getUsers();
  }
  // ngOnChanges() {
  //   this.clearComment && (this.mentionBoxData.innerHTML = '');
  //   console.log(this.clearComment)
  // }
  // fetch users
  getUsers() {
    this.httpSer
      .get(Config.UserManagement.GetAll, { pageIndex: this.itemsLoadCount, pageSize: 10, fullName: this.searchValue })
      .subscribe((res) => {
        if (res) {

          if (res.count == 0) {
            this.showAutocomplete = false
          } else {
            if (this.mentionBoxData.innerText.includes('@')) {
              this.getLength()
              this.showAutocomplete = true;
            }
          }


          if (this.itemsLoadCount == 1)
            this.list = res.data;
          else {
            res.data.forEach(element => {
              this.list.push(element)
            });
          }
        }
      });
  }
  //search on members selection
  searchItems(value: any) {
    this.searchValue = value?.trim();
    this.searchSubject.next(this.searchValue);
  }
  //load more items
  loadMoreItems() {
    this.itemsLoadCount++;
    this.getUsers();

  }


  @HostListener('document:selectionchange', ['$event'])
  onSelectionChange(event: Event): void {
    if (this.isInside) {
      this.inputText = this.mentionBoxData.innerText;

      const selection = window.getSelection();
      const range = selection.getRangeAt(0);

      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(this.mentionBoxData);
      preCaretRange.setEnd(range.endContainer, range.endOffset);

      this.cursorPosition = preCaretRange.toString().length;
      this.lastAtIndex = this.inputText.lastIndexOf('@', this.cursorPosition - 1);
      if (this.lastAtIndex >= 0)
        this.getSearchText();
      else this.showAutocomplete = false;
    }
    else this.showAutocomplete = false;

  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    // Check if the clicked target is outside the component
    if (!this.mentionBoxData.contains(event.target)) {
      this.showAutocomplete = false;
    }
  }

  ngAfterViewInit() {

    this.mentionBoxData = this.mentionBox.nativeElement;

    // Add an event listener for the Backspace key

    this.mentionBoxData.addEventListener('keyup', () => this.getCommentWithUUIDs());
     
    this.mentionBoxData.addEventListener('keydown', (event) => {
      if (event.key == 'Enter') {
        event.preventDefault();
      }
    });
  }

  getSearchText() {
    if (this.inputText.includes('@')) {
      //@ index in inputText
      this.searchText = this.inputText.substring(this.lastAtIndex + 1, this.cursorPosition);
      this.searchText != '=' && this.searchItems(this.searchText);
    } else {
      this.showAutocomplete = false;
    }
  }
  selectName(user) {
    this.mentionedUsers.push(user);

    let lastHTMLAtIndex = this.mentionBoxData.innerHTML.lastIndexOf('@');
    let mentionedUser = `<b contenteditable="false" id="${user.id}" > ${user.fullName}</b>&nbsp;`;
    this.mentionBoxData.innerHTML =
      this.mentionBoxData.innerHTML.slice(0, lastHTMLAtIndex) + mentionedUser +
      this.mentionBoxData.innerHTML.slice((lastHTMLAtIndex + 1) + this.searchText.length);

    this.showAutocomplete = false;

    // this.mentionBoxData.setAttribute('contenteditable',true);
    // let tagsCount = this.countHtmlTags(this.mentionBoxData.innerHTML.slice(0, lastAtIndex));
    // let newTagCount = 1;
    // let textLength = this.getStringLengthWithoutChildElements(this.mentionBoxData.innerHTML.slice(0, lastAtIndex))
    // this.updateElementContent();
    // this.setCursorPosition(tagsCount + newTagCount + textLength);

    this.getCommentWithUUIDs();
    this.searchValue = '';
    this.itemsLoadCount = 1;
    this.mentionBoxData.blur();
  }

  getCommentWithUUIDs() {
    this.textWitUUIDs = this.mentionBoxData.innerHTML;
    this.mentionedUsers.forEach((user) => {
      this.textWitUUIDs = this.textWitUUIDs
        .replace(`<b contenteditable="false" id="${user.id}"> ${user.fullName}</b>`, ' ' + user.id + ' ');

    })
    const spaceRegex = new RegExp('&nbsp;', 'g');
    const tagRegex = /<[^>]*>/g;
    this.textWitUUIDs = this.textWitUUIDs.replace(spaceRegex, '');
    this.textWitUUIDs = this.textWitUUIDs.replace(tagRegex, '');

    this.getComment.emit(this.textWitUUIDs);
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();

    // Get the plain text content from the clipboard
    const plainText = event.clipboardData?.getData('text/plain');

    // Insert the plain text at the current cursor position
    document.execCommand('insertText', false, plainText);
  }
  // setCursorPosition(position: number) {

  //   if (window.getSelection) {
  //     const selection = window.getSelection();
  //     const range = document.createRange();
  //     // Set the range to the desired position
  //     range.setStart(this.mentionBoxData.firstChild, position);
  //     // range.setEnd(this.mentionBoxData.firstChild, position);

  //     // Remove any existing selections
  //     selection.removeAllRanges();

  //     // Add the new range
  //     selection.addRange(range);
  //   }
  // }



  // countHtmlTags(inputString) {
  //   // Create a regular expression to match HTML tags
  //   const regex = /<[^>]*>/g;

  //   // Use match to find all matches of HTML tags
  //   const matches = inputString.match(regex);

  //   // Count the number of matches
  //   const count = matches ? matches.length : 0;

  //   return count / 2;
  // }

  // getStringLengthWithoutChildElements(inputString) {
  //   // Create a temporary element to parse the HTML string
  //   const tempElement = document.createElement('div');
  //   tempElement.innerHTML = inputString;

  //   // Iterate through child nodes and get their text content
  //   let textContent = '';
  //   for (let i = 0; i < tempElement.childNodes.length; i++) {
  //     const child = tempElement.childNodes[i];
  //     if (child.nodeType === Node.TEXT_NODE) {
  //       textContent += child.textContent;
  //     }
  //   }

  //   // Calculate the length of the resulting text content
  //   const lengthWithoutChildElements = textContent.length;

  //   return lengthWithoutChildElements;
  // }
  listPlace: string = '';

  getLength() {
    // Get the position and dimensions of the element
    const elementRect = this.mentionBoxData.getBoundingClientRect();
    // Get the height of the viewport
    const viewportHeight = window.innerHeight;

    // Calculate the distance between the element and the bottom of the window
    const distanceToWindowBottom = viewportHeight - elementRect.bottom;
    if (distanceToWindowBottom < 197) this.listPlace = 'up';
    else this.listPlace = 'down';
  }
}
