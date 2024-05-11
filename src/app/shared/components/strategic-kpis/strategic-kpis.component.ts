import { finalize, takeUntil } from "rxjs/operators";
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  IActionMapping,
  ITreeOptions,
  TreeModel,
  TreeNode,
  TREE_ACTIONS,
  ITreeState,
} from "@circlon/angular-tree-component";
import { TranslateConfigService } from "src/app/core/services/translate-config.service";
import { RequestsCreateService } from "src/app/modules/project-initiation/components/requests-create/services/requests.service";
import { TranslateService } from "@ngx-translate/core";
import { ComponentBase } from "src/app/core/helpers/component-base.directive";
import { Subject } from "rxjs";

@Component({
  selector: "app-strategic-kpis",
  templateUrl: "./strategic-kpis.component.html",
  styleUrls: ["./strategic-kpis.component.scss"],
})
export class StrategicKPIsComponent
  extends ComponentBase
  implements OnInit, OnChanges
{
  @ViewChild("tree") tree;
  @ViewChild("filter") filter;
  state: ITreeState;
  actionMapping: IActionMapping = {
    mouse: {
      expanderClick: (tree, node, $event) => {
        // tree.collapseAll();
        TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
      },
    },
  };

  lang = this.translate.currentLang;

  options: ITreeOptions = {
     actionMapping: this.actionMapping,
    levelPadding: 80,
     displayField: "title",
    // isExpandedField: "expanded",
     animateExpand: true,
    rtl: false,
  };

  @Input() treeData: TreeModel[] = [];
  @Input() selectedKPisIds: number[] = [];

  @Input() readOnly: boolean;
  @Input() isFormSubmitted: boolean;
  strategicImpactForm: FormGroup;
  @Output() onSelect = new EventEmitter<number[]>();
  @Output() onSelectKPIs = new EventEmitter<number[]>();

  private endSub$ = new Subject();

  nodes: any[] = [];
  checkedIds: number[] = [];
  checkedKPIs: any[] = [];

  checkedFlag: boolean = false;
  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private fb: FormBuilder,
    private translationService: TranslateConfigService,
    private requestsCreateService: RequestsCreateService
  ) {
    super(translateService, translate);
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit() {
    // this.initStrategicImpactForm();
    this.handleLangChange();

    // select selectedIds checkboxes
    this.setSelectedCheckboxes();
    setTimeout(() => {
      this.options.rtl = this.lang == "ar";
    }, 100);
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange.pipe(takeUntil(this.endSub$)).subscribe(() => {
      this.lang = this.translate.currentLang;
      this.options.rtl = this.lang == "ar";
    });
  }

  setSelectedCheckboxes() {
    this.treeData.forEach(node => {
      this.activeCheckBoxes(node);
    });
  }
  filterValue = "";
  getData(res) {
    let data = this.filter?.nativeElement?.value;
    if (!data) {
       this.collapseAll();
      this.setSelectedCheckboxes();
    }
  }

  collapseAll() {
    this.state = {
      ...this.state,
      expandedNodeIds: {},
    };
  }
  public check(node, checked) {
    node.data ? (node.data.checked = checked) : (node.checked = checked);
    if (checked) {
      node.expand();
    } else {
      this.checkedFlag = false;
      !this.isNoChildChecked(node) && node.collapse();
    }
    this.checkedIds = [];
    this.checkedKPIs = [];
    this.treeData.forEach(parent => {
      this.getCheckedIds(parent);
    });
    this.onSelect.emit(this.checkedIds);
    this.onSelectKPIs.emit(this.checkedKPIs);
  }

  // public updateChildNodeCheckbox(node, checked) {
  //   node.data.checked = checked;
  //   node.data.indeterminate = false;
  //   if (checked) {
  //     if (node.children && node.level >= node.level + 1) {
  //       node.children.forEach((child) => this.updateChildNodeCheckbox(child, checked));
  //     }
  //   } else {
  //     if (node.children) {
  //       node.children.forEach((child) => this.updateChildNodeCheckbox(child, checked));
  //     }
  //   }
  // }

  // public updateParentNodeCheckbox(node) {
  //   if (!node) {
  //     return;
  //   }

  //   let allChildrenChecked = true;
  //   let noChildChecked = true;

  //   for (const child of node.children) {
  //     if (!child.data.checked || child.data.indeterminate) {
  //       allChildrenChecked = false;
  //     }
  //     if (child.data.checked) {
  //       noChildChecked = false;
  //     }
  //   }

  //   if (allChildrenChecked) {
  //     node.data.checked = true;
  //     node.data.indeterminate = false;
  //   } else if (noChildChecked) {
  //     node.data.checked = false;
  //     node.data.indeterminate = false;
  //   } else {
  //     node.data.checked = true;
  //     node.data.indeterminate = true;
  //   }
  //   this.updateParentNodeCheckbox(node.parent);
  // }

  filterFn(value: string, treeModel: TreeModel) {
    treeModel.filterNodes((node: TreeNode) => {
      this.fuzzysearch(value, node.data.title);
    });
  }

  fuzzysearch(needle: string, haystack: string) {
    const haystackLC = haystack.toLowerCase();
    const needleLC = needle.toLowerCase();

    const hlen = haystack.length;
    const nlen = needleLC.length;

    if (nlen > hlen) {
      return false;
    }
    if (nlen === hlen) {
      return needleLC === haystackLC;
    }
    outer: for (let i = 0, j = 0; i < nlen; i++) {
      const nch = needleLC.charCodeAt(i);

      while (j < hlen) {
        if (haystackLC.charCodeAt(j++) === nch) {
          continue outer;
        }
      }
      return false;
    }
    return true;
  }

  // initStrategicImpactForm() {
  //   this.strategicImpactForm = this.fb.group({
  //     projectStrategicKPI: [false, Validators.requiredTrue],
  //   })

  //   this.strategicImpactForm.statusChanges.subscribe(status => {
  //     this.requestsCreateService.saveStepperState("strategicImpactForm", status === "VALID" ? true : false)
  //   })
  // }

  // get getStrategicImpactForm() {
  //   return this.strategicImpactForm.controls
  // }

  getCheckedIds(node: any) {
    if (node.checked === true) {
      this.checkedIds.push(node.id);
      // send object to lay out it if needed
      const nodeWithoutChildren = { ...node, children: undefined };
      this.checkedKPIs.push(nodeWithoutChildren);
    }
    if (node.children) {
      for (const child of node.children) {
        this.getCheckedIds(child);
      }
    }
  }
  // get checked objects ids
  activeCheckBoxes(node: any) {
    if (this.selectedKPisIds.includes(node.id)) {
      node.checked = true;
    }
    if (node.children) {
      for (const child of node.children) {
        this.activeCheckBoxes(child);
      }
    }
    // check if onr of children in any level is checked then expand the node
    this.isChildChecked(node) && (node.isExpanded = true);
    // reset Check flag
    this.checkedFlag = false;
  }

  isChildChecked(node: any): boolean {
    if (node.children) {
      for (const child of node.children) {
        if (child.checked) this.checkedFlag = true;
        this.isChildChecked(child);
      }
    }
    return this.checkedFlag;
  }

  isNoChildChecked(node: any): boolean {
    if (node.data.children) {
      for (const child of node.data.children) {
        if (child.checked) this.checkedFlag = true;
        this.isChildChecked(child);
      }
    }
    return this.checkedFlag;
  }
}
