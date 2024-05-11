import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslationService } from 'src/app/core/services/translate.service';
import { RequestsCreateService } from '../../services/requests.service';
import { ArrayDataSource } from '@angular/cdk/collections';
import { NestedTreeControl } from '@angular/cdk/tree';
import { IActionMapping, ITreeOptions, TreeModel, TreeNode, TREE_ACTIONS } from 'angular-tree-component';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';

@Component({
  selector: 'app-requests-strategic-impact',
  templateUrl: './requests-strategic-impact.component.html',
  styleUrls: ['./requests-strategic-impact.component.scss']
})
export class RequestsStrategicImpactComponent implements OnInit, OnChanges {
  @ViewChild('tree') tree;
  actionMapping: IActionMapping = {
    mouse: {
      // click: (tree, node) => this.check(node, !node.data.checked)
    }
  };

  options: ITreeOptions = {
    actionMapping: this.actionMapping,
    levelPadding: 80,
  };

  public check(node, checked) {

    this.updateChildNodeCheckbox(node, checked);
    this.updateParentNodeCheckbox(node.realParent);
    if (checked) {
      node.expand()
      if (node.data.goalType?.name === 'KPI') {
        this.onProjectStrategicKPIChange(true, node.data)
      }
    } else {
      this.onProjectStrategicKPIChange(false, node.data)
    }

  }
  public updateChildNodeCheckbox(node, checked) {
    node.data.checked = checked;
    node.data.indeterminate = false;
    if (checked) {
      if (node.children && node.level >= node.level + 1) {
        node.children.forEach((child) => this.updateChildNodeCheckbox(child, checked));
      }
    } else {
      if (node.children) {
        node.children.forEach((child) => this.updateChildNodeCheckbox(child, checked));
      }
    }
  }

  public updateParentNodeCheckbox(node) {
    if (!node) {
      return;
    }

    let allChildrenChecked = true;
    let noChildChecked = true;

    for (const child of node.children) {
      if (!child.data.checked || child.data.indeterminate) {
        allChildrenChecked = false;
      }
      if (child.data.checked) {
        noChildChecked = false;
      }
    }

    if (allChildrenChecked) {
      node.data.checked = true;
      node.data.indeterminate = false;
    } else if (noChildChecked) {
      node.data.checked = false;
      node.data.indeterminate = false;
    } else {
      node.data.checked = true;
      node.data.indeterminate = true;
    }
    this.updateParentNodeCheckbox(node.parent);
  }

  filterFn(value: string, treeModel: TreeModel) {
    if (value) {
      treeModel.expandAll()
      treeModel.filterNodes((node: TreeNode) => this.fuzzysearch(value, node.data.name));
    } else {
      treeModel.collapseAll()
    }
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


  @Input() treeData: any = []
  treeControl = new NestedTreeControl<any>((node: any) => node.children);
  dataSource;
  @Input() readOnly: boolean
  @Input() isFormSubmitted: boolean
  @Input() data: string
  @Input() lang
  @Input() selectedDepartmentId
  kpisList: any
  strategicImpactForm: FormGroup

  @Output() onEdit: EventEmitter<any> = new EventEmitter();
  selectedDepartmentChildren: any;
  constructor(private fb: FormBuilder,
    private translationService: TranslateConfigService,
    private requestsCreateService: RequestsCreateService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit() {
    this.initStrategicImpactForm()
  }

  initStrategicImpactForm() {
    this.strategicImpactForm = this.fb.group({
      projectStrategicKPI: [false, Validators.requiredTrue],
    })

    this.strategicImpactForm.statusChanges.subscribe(status => {
      this.requestsCreateService.saveStepperState("strategicImpactForm", status === "VALID" ? true : false)
    })
  }

  get getStrategicImpactForm() {
    return this.strategicImpactForm.controls
  }


  onProjectStrategicKPIChange(checked, node) {
    const formArray: FormArray = this.strategicImpactForm.controls.projectStrategicKPI as FormArray;
    /* Selected */
    if (checked) {
      // Add a new control in the arrayForm
      formArray.push(new FormControl(node));
      node.selected = true
    }
    /* unselected */
    else {
      // find the unselected element
      formArray.removeAt(this.strategicImpactForm.controls.projectStrategicKPI.value.findIndex(item => item.id = node.id))
    }
  }





}


