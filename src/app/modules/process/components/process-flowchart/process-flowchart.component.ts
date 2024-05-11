import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { TranslationService } from 'src/app/core/services/translate.service';
// import { SidePanelService } from 'src/app/shared/side-panel/side-panel.service';
declare let $: any;
@Component({
  selector: 'app-process-flowchart',
  templateUrl: './process-flowchart.component.html',
  styleUrls: ['./process-flowchart.component.scss']
})
export class ProcessFlowchartComponent implements OnInit, OnChanges {
  @Input() states;
  @Output() viewState: EventEmitter<any> = new EventEmitter();
  data = {
    operators: {},
    links: {}
  };

  operatorsPerRow = 4;
  offsetLeft = 0;
  offsetTop = 0;
  lang: any;
  constructor(private translationService: TranslationService) {
    this.lang = this.translationService.language

  }

  ngOnInit() {
  }

  buildFlowchart() {
    this.data = {
      operators: {},
      links: {}
    }
    this.states.forEach((state, i) => {
      this.data.operators[state.id] = {
        top: this.incrementLeft(i),
        left: this.incrementTop(i),
        properties: {
          title: this.lang == 'en' ? state.title.en : state.title.ar,
          inputs: this.generateInputObject(state.id, state.title.en),
          outputs: this.generateOutputObject(state.transitions)
        }
      }

    });
    let allTransitions = this.states.map(state => state.transitions)
    allTransitions = Array.prototype.concat.apply([], allTransitions);

    allTransitions.forEach((transition, i: number) => {
      this.data.links['link' + i] = {
        fromOperator: transition.fromStateId,
        toOperator: transition.toStateId,

        fromConnector: transition.id,
        toConnector: transition.id,
      }
    });
  }

  ngOnChanges() {
    this.offsetTop = 0
    this.offsetLeft = 0
    if (this.states) {
      this.buildFlowchart()
      this.initFlowChart()
    }

  }

  initFlowChart() {
    const component = this;

    $('#example').flowchart({
      verticalConnection: true,
      // allows to add links by clicking on lines
      canUserEditLinks: false,

      // enables drag and drop
      canUserMoveOperators: true,

      // distance between the output line and the link
      distanceFromArrow: 3,

      // default operator class
      defaultOperatorClass: 'flowchart-default-operator',

      // default color
      defaultLinkColor: '#3366ff',

      // default link color
      defaultSelectedLinkColor: 'black',

      // width of the links
      linkWidth: 3,

      // <a href="https://www.jqueryscript.net/tags.php?/grid/">grid</a> of the operators when moved
      grid: 0,

      // allows multiple links on the same input line
      multipleLinksOnOutput: true,

      // allows multiple links on the same output line
      multipleLinksOnInput: true,

      // Allows to vertical decal the links (in case you override the CSS and links are not aligned with their connectors anymore).
      linkVerticalDecal: 0,

      // callbacks
      onOperatorSelect: function (operatorId) {
        component.viewState.emit(operatorId)
        // return true;
      },
      onOperatorUnselect: function () {
        return true;
      },
      onOperatorMouseOver: function (operatorId) {
        return true;
      },
      onOperatorMouseOut: function (operatorId) {
        return true;
      },
      onLinkSelect: function (linkId) {
        return true;
      },
      onLinkUnselect: function () {
        return true;
      },
      onOperatorCreate: function (operatorId, operatorData, fullElement) {
        return true;
      },
      onLinkCreate: function (linkId, linkData) {
        return true;
      },
      onOperatorDelete: function (operatorId) {
        return true;
      },
      onLinkDelete: function (linkId, forced) {
        return true;
      },
      onOperatorMoved: function (operatorId, position) {

      },
      onAfterChange: function (changeType) {
      }
    });



    $('#example').flowchart('setData', component.data)

  }

  generateInputObject(stateId, stateName) {
    let inputs = {}
    this.states.forEach(state => {
      state.transitions.forEach(transition => {
        if (transition.toStateId == stateId) {
          inputs[transition.id] = { label: '' }
        }
      });
    });
    return inputs
  }

  generateOutputObject(transitions) {
    let outputs = {}
    if (transitions) {
      transitions.forEach(transition => {
        outputs[transition.id] = { label: this.lang == 'en' ? transition.label.en : transition.label.ar }
      });
    }
    return outputs
  }

  incrementLeft(i) {
    return this.offsetLeft += 120
  }

  incrementTop(i) {
    return this.offsetTop += 120
  }


}
