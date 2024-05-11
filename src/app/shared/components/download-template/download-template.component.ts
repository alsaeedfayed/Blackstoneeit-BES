import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';

@Component({
    selector: 'download-template',
    templateUrl: './download-template.component.html',
    styleUrls: ['./download-template.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: DownloadTemplateComponent,
            multi: true,
        },
    ],
})
export class DownloadTemplateComponent implements ControlValueAccessor, OnInit {

    private onChange = (value: string) => { };
    private onTouched = () => { };
    public lang = this.translate.currentLang;
    get isRequired() {
        return this.control?.hasValidator(Validators.required);
    }
    @Input() control: FormControl | undefined;
    @Input() title: string = null;
    @Input() text: string = null;
    @Input() uri: string = null;
    @Input() icon: string = null;

    constructor(private translate: TranslateService, private _http: HttpHandlerService) { }

    ngOnInit(): void { 
        this.handleLangChange();
    }

    private handleLangChange() {
        this.translate.onLangChange.subscribe((language) => {
            this.lang = language.lang;
        });
    }

    writeValue(obj: any): void {
      // this.value = obj;
      // this.onChange(obj);
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        //this.disabled = isDisabled;
    }  

    downloadTemplate() {
        if(this.uri) {
            this._http.post(Config.fileService.getFilesUrls, [this.uri])
                .subscribe(data => {
                window.open(data[0]?.fileUrl);
            })
        }
    }
    
}
