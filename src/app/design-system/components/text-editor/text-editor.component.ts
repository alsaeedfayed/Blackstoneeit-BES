import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormControl,
  Validators,
} from "@angular/forms";
import { AngularEditorConfig } from "@kolkov/angular-editor";

@Component({
  selector: "app-text-editor",
  templateUrl: "./text-editor.component.html",
  styleUrls: ["./text-editor.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TextEditorComponent,
      multi: true,
    },
  ],
})
export class TextEditorComponent implements ControlValueAccessor, OnInit {

  value: string = "";

  @Input() id: string = "";
  @Input() title: string;
  @Input() placeholder: string = "";
  @Input() control: FormControl | undefined;

  // attachments inputs
  @Input() hasAttachments: boolean = true;
  @Input() isAttachmentsRequired: boolean = false;
  @Input() attachmentsFiles: any = [];
  @Input() supportedAttachmentSize: number = 2;
  @Input() supportedAttachmentHint: string;
  @Input() supportedAttachmentTypes: string[] = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  private _disable: boolean = false;
  public get disable(): boolean {
    return this._disable;
  }
  @Input() public set disable(value: boolean) {
    this._disable = value;
    this.editorConfig.editable = !this._disable;
  }
  @Input() isSubmitted: boolean = false;
  @Input() length: number = 0;
  @Input() minLength: number = 0;
  @Input() showValidations: boolean = true;

  @Output() onKeyup = new EventEmitter();

  // attachments outputs
  @Output() onUpload = new EventEmitter();
  @Output() deleteFile = new EventEmitter();

  private onChange = (value: string) => {};
  private onTouched = () => {};

  get isRequired() {
    return this.control?.hasValidator(Validators.required);
  }

  get getAttachmentsFiles(): any {
    if (!!this.control?.errors || (this.isAttachmentsRequired && !this.attachmentsFiles.length)) {
      delete this.control?.errors?.emptyAttachments;

      this.control.setErrors({
        ...this.control?.errors,
        ...(!this.attachmentsFiles.length && { 'emptyAttachments': true }),
      });
    } else {
      this.control.setErrors(null);
    }

    return this.attachmentsFiles;
  }

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "150px",
    translate: "yes",
    enableToolbar: true,
    showToolbar: true,
    defaultParagraphSeparator: "",
    defaultFontName: "",
    defaultFontSize: "3",
    sanitize: true,
    outline: false,
    toolbarPosition: "top",
    toolbarHiddenButtons: [
      [
        "subscript",
        "superscript",
        "justifyLeft",
        "justifyCenter",
        "justifyRight",
        "justifyFull",
        "heading",
        "fontName",
      ],
      [
        "textColor",
        "backgroundColor",
        "customClasses",
        "insertImage",
        "insertVideo",
        "insertHorizontalRule",
        "removeFormat",
        "toggleEditorMode",
      ],
    ],
  };

  constructor() {}

  ngOnInit(): void {}

  writeValue(obj: any): void {
    this.value = obj;
    this.onChange(obj);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disable = isDisabled;
  }

  focus() {
    this.onTouched();
  }

  change() {
    this.onChange(this.value);
  }

  keyup() {
    this.onKeyup.emit(this.value);
  }

  onUploadFile(event) {
    this.onUpload.emit(event);
  }

  onDeleteFile(event) {
    this.deleteFile.emit(event);
  }
}
