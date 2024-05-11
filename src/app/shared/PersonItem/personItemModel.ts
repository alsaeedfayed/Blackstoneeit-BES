import { ToastrService } from 'ngx-toastr';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { switchMap, takeUntil, finalize } from 'rxjs/operators';
import { combineLatest, Subject } from 'rxjs';
import { Injectable, EventEmitter } from '@angular/core';
import { AtachmentService } from 'src/app/core/services/atachment.service';
import { ImageService } from './image.service';
import { iOwner, IPerson } from './iPerson';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class PersonItemModel {
  //====================Events =====================
  public onClick: EventEmitter<IPerson> = new EventEmitter<IPerson>();

  // ===================== Data ====================
  public data: IPerson;
  public ownerData: iOwner;
  public imgUrl: string | ArrayBuffer;
  public isImageUploading: boolean = false;
  private endSub$ = new Subject();
  public noCursor: boolean;

  constructor(
    private imageService: ImageService,
    private attachmnetSer: AtachmentService,
    private _http: HttpHandlerService,
    private toastSer: ToastrService,
    private translateSer: TranslateService,
  ) { }

  // Name
  public get Name() {
    let matches = [];
    matches = this.data.name?.match(/\b(\w)/g) || this.data.name?.match(/./u);
    if (matches) return matches.join('').slice(0, 2);
    return null;
  }

  public get ownerName() {
    let matches = [];
    matches =
      this.ownerData.name?.en.match(/\b(\w)/g) ||
      this.ownerData.name?.en.match(/./u);
    if (matches) return matches.join('').slice(0, 2);
    return null;
  }

  public setImage(name: string) {
    this.imageService
      .setFileURL(name)
      .pipe(takeUntil(this.endSub$))
      .subscribe((res) => {
        this.imgUrl = res[0]?.fileUrl;
      });
  }

  public getImage() {
    return this.imgUrl;
  }

  public uploadFile(event: Event) {
    this.isImageUploading = true;
    const fileUploaded = (event.target as HTMLInputElement).files[0];
    let fileDetails = {
      file: fileUploaded,
      name: fileUploaded.name,
      size: (fileUploaded.size / (1024 * 1024)).toFixed(2),
      extension: fileUploaded.name.split('.').pop(),
    };
    combineLatest(this.attachmnetSer.UploadAllFilesToCloud([fileDetails]))
      .pipe(
        takeUntil(this.endSub$),
        finalize(() => (this.isImageUploading = false)),
        switchMap((files) => {
          const reqBody = {
            profilePicture: {
              fileName: files[0].fileName,
              extension: files[0].extension,
            },
          };
          fileDetails.name = files[0].fileName;
          return this._http.put(Config.UserManagement.updateProfilePicture, reqBody);
        })
      )
      .subscribe((res) => {
        // this.setImage(fileDetails.name);
        const fileReader = new FileReader();
        fileReader.onload = () => {
          this.imgUrl = fileReader.result!;
        };
        fileReader.readAsDataURL(fileUploaded);
        this.toastSer.success(this.translateSer.instant('shared.imageUpdatedSuccessfully'));
      });
  }

  // Click
  public clickItem() {
    this.onClick.emit(this.data);
  }

  public endSubs() {
    this.endSub$.next('');
    this.endSub$.complete();
  }
}
