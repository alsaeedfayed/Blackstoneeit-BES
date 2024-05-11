import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';

@Component({
  selector: 'app-select-tree',
  templateUrl: './select-tree.component.html',
  styleUrls: ['./select-tree.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectTreeComponent,
      multi: true,
    },
  ],
})
export class SelectTreeComponent implements OnInit,OnChanges {
  @Input() bindVlaue: any = 'id';
  @Input() bindLabel: any = 'name';
  @Input() title: any = '';
  @Input() placeholder: string = null;
  @Input() control: AbstractControl | undefined;
  @Input() disabled: boolean = false;
  @Input() search: boolean = true;
  @Input() multiple: boolean = true;
  @Input() isSubmitted: boolean = false;
  @Input() CheckStrictly: boolean = false;
  @Output() chnageValue = new EventEmitter();

  @Input() set items(value: any) {
    if (value) {
      this.itemsList = value;
    }
  }

  get isRequired() {
    return this.control?.hasValidator(Validators.required);
  }
  private onChange_ = (value: string) => {};
  private onTouched = () => {};
  initValue: any = [];
  itemsList: any[] = [];
  nodes: NzTreeNodeOptions[] = [];

  lang: string;

  constructor(private translateService: TranslateService) {
    this.lang = this.translateService.currentLang;
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.handleTreeValue();
  }

  ngOnInit(): void {
    this.handleTreeValue();
    this.handleLangChange();
  }

  private handleLangChange() {
   // console.log(this.itemsList);
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
      this.itemsList = [...this.itemsList];
      this.handleTreeValue();
    });
  }

  writeValue(obj: any): void {
    this.initValue = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange_ = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  handleTreeValue() {
    const dig = (items, path = '0', level = 3): NzTreeNodeOptions[] => {
      const list = [];

      if (items?.length > 0) {
        for (let i = 0; i < items.length; i += 1) {
          const key = `${path}-${i}`;
          const treeNode: NzTreeNodeOptions = {
            title:
              this.lang === 'en'
                ? items[i]?.name
                : items[i]?.arabicName
                ? items[i]?.arabicName
                : items[i]?.name,
            key: items[i]?.groupId
              ? items[i]?.groupId
              : items[i]?.id
              ? items[i]?.id
              : items[i]?.name,
            expanded: false,
            children: items[i].children,
            isLeaf: false,
          };

          if (level > 0) {
            treeNode.children = dig(treeNode.children, key, level - 1);
          } else {
            treeNode.isLeaf = true;
          }
          list.push(treeNode);
        }
      }

      return list;
    };
    this.nodes = dig(this.itemsList);
  }

  setTouched() {
  //  console.log('hhh');
  }

  changeValue(event) {
    // const flattenedData = this.flattenChildren(this.nodes);
    // this.initValue = flattenedData;

    this.onChange_(this.initValue);
    this.chnageValue.emit(this.initValue);
  }

  // flattenChildren(arr) {
  //   let result = [];

  //   function traverse(children) {
  //     for (let i = 0; i < children.length; i++) {
  //       const { title, key, expanded, children: nestedChildren, ...rest } = children[i];
  //       result.push({ title, key, expanded, ...rest });
  //       if (nestedChildren && nestedChildren.length > 0) {
  //         traverse(nestedChildren);
  //       }
  //     }
  //   }

  //   traverse(arr);

  //   return result.filter(item => item.checked).map(item => item.key);
  // }
}
