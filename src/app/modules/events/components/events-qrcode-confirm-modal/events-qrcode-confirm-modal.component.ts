import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { TranslationService } from "src/app/core/services/translate.service";
import { ToastrService } from "ngx-toastr";
declare let $: any;

@Component({
  selector: "events-qrcode-confirm-modal",
  templateUrl: "./events-qrcode-confirm-modal.component.html",
  styleUrls: ["./events-qrcode-confirm-modal.component.scss"],
})

export class EventsQRcodeConfirmModalComponent implements OnInit, OnChanges {
  @Input() title: string;
  @Input() link: string;
  @Input() content: string;
  @Input() customContent;

  // @Output() confirm = new EventEmitter();
  @Output() cancel = new EventEmitter();
  lang: string;

  constructor(
    private toastr: ToastrService,
    private translationService: TranslationService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {
    this.lang = this.translationService.language;
  }

  modalconfirm() {
    //this.confirm.emit(this.reason);
    $("#QRCodeModalCenter").modal("hide");
    $("body").removeClass("modal-open");
    $(".modal-backdrop").remove();
  }

  copyLink() {
    this.modalconfirm();
    const selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = this.link?.["registrationLink"];
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);

    this.toastr.success("Link is copied successfully");
  }

  downloadQR(data: any) {
    this.modalconfirm();
    this.downloadImage(data.url, data.title);
  }

  onCancel() {
    this.cancel.emit();
  }

  downloadImage(url, name) {
    fetch(url, {
      // mode: 'no-cors',
      // headers: {
      // 'Access-Control-Allow-Origin': '*',
      // 'Content-Type': 'image/*'
      // }
    })
      .then(resp => resp.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        // the filename you want
        a.download = name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(err => alert(err));
  }
}
