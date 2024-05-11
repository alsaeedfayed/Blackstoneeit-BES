import { Directive, OnInit, ElementRef, Renderer2, Input, Host, forwardRef, Provider } from '@angular/core';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { Config } from 'src/app/core/config/api.config';


@Directive({
  // selector: 'input[type="text"],textarea'
  selector: '[inputtranslation]',
})

export class InputTextTranslationDirective implements OnInit {

  private parent;
  private translateIcon;
  private translateSection;
  private translationValue: string;
  @Input() from: string;
  @Input() to: string;
  @Input() public set inputvalue(val:string){
    if (val)
      this.addTranslation();
  };

  constructor(private renderer: Renderer2,private el: ElementRef, private http: HttpHandlerService) {
    this.parent = this.renderer.parentNode(this.el.nativeElement);
    this.translateIcon = document.createElement('div');
    this.translateSection = document.createElement('section');
  }

  ngOnInit() {
    (this.el.nativeElement as HTMLInputElement).addEventListener("input",()=>{
      if (this.el.nativeElement.value)
        this.addTranslation();
      else
        this.translateIcon.style.display = 'none'
    })
  }

  private addTranslation() {
    if(this.parent)
      this.createTranslateIcon();
  }

  private createTranslateIcon() {
    this.translateIcon.style.display = 'flex'
    if (!this.parent.querySelector(".translation")){
      this.translateIcon?.classList?.add('translation')

      if(this.parent.children[1].nodeName.toLowerCase() == 'textarea')
        this.translateIcon?.classList?.add('textarea')
      else
        this.translateIcon?.classList?.remove('textarea')

      if(this.parent.dir == "rtl") {
        this.translateIcon?.classList?.add('rtl')
        this.translateSection?.classList?.add('rtl')
      }
      else {
        this.translateIcon?.classList?.remove('rtl')
        this.translateSection?.classList?.remove('rtl')
      }

      const span = document.createElement('span');
      span.innerHTML = "T";
      this.translateIcon?.appendChild(span);
      this.parent?.appendChild(this.translateIcon);
      this.translateIcon.addEventListener("click", this.addTranslatedSection.bind(this));
    }
  }

  async getTranslation(key:string , text: string){
    let data = await this.http.post(Config.Lookups.createTranslation, {
      "text": [
        {
          "key": key,
          "value": text
        }
      ],
      "from": this.from,
      "to": this.to
    }).toPromise();
    return data.translations[0].translatedValue;
  }

  private async addTranslatedSection() {
    const key = this.parent.getElementsByTagName('label')[0].innerHTML.replaceAll(/\s/g, '').replace(':', '');
    const value = this.parent.getElementsByTagName('textarea').length > 0 ? this.parent.getElementsByTagName('textarea')[0].value : this.parent.getElementsByTagName('input')[0].value;
    this.translationValue = await this.getTranslation(key, value);
    if (this.parent && !(this.translateSection as HTMLDivElement).className.includes("translationSection")) {
      // let translateSection = document.createElement('section');
      this.translateSection?.classList.add('translationSection')

      let span = document.createElement('span');

      span.innerHTML = this.translationValue;

      let icons = document.createElement('div');
      icons?.classList.add('icons');

      let cloneIcon = document.createElement('div');
      cloneIcon?.classList.add('icon', 'clone')
      cloneIcon.innerHTML = '<i class="bx bxs-copy-alt"></i>';

      let closeIcon = document.createElement('div');
      closeIcon?.classList.add('icon', 'close')
      closeIcon.innerHTML = '<i class="bx bx-x"></i>';

      this.translateSection?.appendChild(span);
      icons?.appendChild(cloneIcon);
      icons?.appendChild(closeIcon);
      this.translateSection?.appendChild(icons);

      this.parent?.appendChild(this.translateSection);

      this.parent.querySelector('.translationSection .icons .icon.clone')?.addEventListener("click",this.copyText.bind(this));
      this.parent.querySelector('.translationSection .icons .icon.close')?.addEventListener("click",this.closeTranslationSection.bind(this));
    }
    else {
      this.translateSection.querySelector('span').innerHTML = this.translationValue;
      this.parent?.appendChild(this.translateSection);
    }

  }

  private copyText() {
    navigator.clipboard.writeText(this.translationValue);
    this.closeTranslationSection();
  }

  private closeTranslationSection() {
    (this.parent.querySelector(".translationSection") as HTMLDivElement)?.remove();
  }

}
