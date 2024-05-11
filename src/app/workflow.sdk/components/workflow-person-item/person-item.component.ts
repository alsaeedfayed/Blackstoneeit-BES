import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnDestroy,
  ElementRef,
  HostListener,
} from '@angular/core';
import { PersonItemModel } from './personItemModel';
import { iOwner, IPerson, IRequester } from './iPerson';
import { peronItemModes } from './peroniItem.enum';

@Component({
  selector: 'workflow-person-item',
  templateUrl: './person-item.component.html',
  styleUrls: ['./person-item.component.scss'],
  providers: [PersonItemModel],
})
export class WorkflowPersonItemComponent implements OnDestroy {

  @Input() hasUserCard: boolean = true;
  @Input() isUserCardFixed: boolean = false;
  @Input() isTwoWordsOnly: boolean = false;
  @Input() public set item(item: IPerson) {
    this.model.data = item;
    if (item) {
      this.model.setImage(this.model.data.image);
    }
  }
  @Input() public set ownerItem(item: iOwner) {
    this.model.ownerData = item;
    if (item) {
      this.model.setImage(this.model.ownerData.profileImage);
    }
  }

  @Input() public set requesterItem(item: IRequester) {
    this.model.data = {
      backgroundColor: '#5271ff',
      image: item?.fileName,
      isActive: true,
      name: item?.fullName,
      email: item?.email,
      id: item?.id,
      position: item?.position,
    };
    if (item) {
      this.model.setImage(item?.fileName);
    }
  }

  @Input() public set creatorData(item) {
    if (item) {
      this.model.data = {
        image: item?.fileName,
        position: item?.position,
        id: item?.id,
        name: item?.fullName,
        email: item?.email,
        isActive: false,
        backgroundColor: '#5271ff',
      };
      this.model.setImage(this.model.data.image);
    }
  }
  @Input() CompMode: peronItemModes = peronItemModes.personMode;
  @Input() isAllowedToChangePhoto: boolean = false;

  @Input() public set backgroundColor(value: string) {
    this.model.data.backgroundColor = value;
  }
  @Input() public set noCursor(value: boolean) {
    this.model.noCursor = value;
  }

  @Output() logout = new EventEmitter();
  @Output() public onClick: EventEmitter<IPerson> = new EventEmitter<IPerson>();
  displayDropdown: boolean;
  displayUserCard: boolean;

  // close dropdown menu in case clicked outside it
  @HostListener('document:click', ['$event']) onclick(evt: any) {
    if (!this.eRef.nativeElement.contains(evt.target)) {
      this.displayDropdown = false;
      this.displayUserCard = false;
    }
  }

  constructor(
    public model: PersonItemModel,
    private eRef: ElementRef,
  ) {}

  public get personMode() {
    return this.CompMode === peronItemModes.personMode;
  }

  public get ownerMode() {
    return this.CompMode === peronItemModes.ownerMode;
  }

  ngOnDestroy(): void {
    this.model.endSubs();
  }

  toggleDropdown() {
    if (this.isAllowedToChangePhoto) {
      this.displayDropdown = !this.displayDropdown;
    }
  }

  toggleUserCard(e) {
    e.stopPropagation();

    this.displayUserCard = !this.displayUserCard;
    window.dispatchEvent(new Event('resize'));
  }

  onLogout() {
    this.logout.emit();
  }
}
