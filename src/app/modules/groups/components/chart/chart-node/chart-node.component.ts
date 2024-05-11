import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GroupsService } from '../../../services/groups.service';
import { Level } from '../../groups-main/enums';
import { INode } from '../node';

@Component({
  selector: 'chart-node',
  templateUrl: './chart-node.component.html',
  styleUrls: ['./chart-node.component.scss'],
})
export class ChartNodeComponent implements OnInit, OnChanges {
  @Input() node: INode;

  @Input() hasParent = false;

  @Input() direction: 'vertical' | 'horizontal' = 'vertical';

  lang = this.translate.currentLang;
  editLabel = this.translate.instant('shared.edit');
  deleteLabel = this.translate.instant('shared.delete');

  levels: any = [
    {
      value: Level.L0,
      label: 'L0',
      labelAr: 'L0',
    },
    {
      value: Level.L1,
      label: 'L1',
      labelAr: 'L1',
    },
    {
      value: Level.L2,
      label: 'L2',
      labelAr: 'L2',
    },
    {
      value: Level.L3,
      label: 'L3',
      labelAr: 'L3',
    },
  ];

  constructor(
    private translate: TranslateService,
    private groupsService: GroupsService
  ) {}

  ngOnInit(): void {
    this.handleLangChange();
  }

  private handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.lang = language.lang;
      this.editLabel = this.translate.instant('shared.edit');
      this.deleteLabel = this.translate.instant('shared.delete');
      if (this.node) {
        this.node.options = [
          {
            item: this.editLabel,
            disabled: false,
            textColor: '',
            icon: 'bx bxs-edit',
          },
          {
            item: this.deleteLabel,
            disabled: this.node.children?.length,
            textColor: '',
            icon: 'bx bx-trash',
          },
        ];
      }
    });
  }

  ngOnChanges() {
    if (this.node) {
      this.node.Level = this.levels.find(
        (level) => level.value === this.node.level
      );
      this.node.options = [
        {
          item: this.editLabel,
          disabled: false,
          textColor: '',
          icon: 'bx bxs-edit',
        },
        {
          item: this.deleteLabel,
          disabled: this.node.children?.length,
          textColor: '',
          icon: 'bx bx-trash',
        },
      ];
    }
  }

  onSelect(e, group) {
    this.groupsService.onSelectOption.next({ e: e, group: group });
  }
}
