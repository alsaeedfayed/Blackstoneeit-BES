import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-priority-setting',
  templateUrl: './priority-setting.component.html',
  styleUrls: ['./priority-setting.component.scss']
})
export class PrioritySettingComponent implements OnInit, OnChanges {
  @Input() criterias
  @Input() lang: string
  @Input() requestData
  criteriaOptions = [
    {
      title: "Low",
      titleAr: "منخفضة",
      id: "1",
      value: 20,
      checked: false
    },
    {
      title: "Medium",
      titleAr: "متوسطة",
      id: "2",
      value: 60,
      checked: false,
    },
    {
      title: "High",
      titleAr: "عالية",
      id: "3",
      value: 80,
      checked: false
    },
  ]
  selectedCriteriasScores: any = [];
  overridingCriteriaControl = new FormControl(null)
  priorityLevel: string = 'Low'
  strategicFitScore: number = 0;
  feasibilityScore: number = 0;
  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.criterias) {
      this.priorityLevel = this.requestData.priorityLevel ? this.requestData.priorityLevel.title.en : "High"
      this.selectedCriteriasScores = []
      this.criterias?.strategicFit?.forEach(element => {
        if (element.value) {
          this.selectedCriteriasScores.push({
            type: element.type,
            criteriaId: element.id,
            score: element.value,
            value: element.weight * this.criteriaOptions.find(item => item.title == element.value)?.value / 100
          })
        }
      });
      this.criterias?.feasibility.forEach(element => {
        if (element.value) {
          this.selectedCriteriasScores.push({
            type: element.type,
            criteriaId: element.id,
            score: element.value,
            value: element.weight * this.criteriaOptions.find(item => item.title == element.value)?.value / 100
          })
        }
      });
      this.strategicFitScore = 0
      this.feasibilityScore = 0
      this.strategicFitScore = this.selectedCriteriasScores.filter(item => item.type === 'Strategic Fit').reduce((partialSum, a) => partialSum + a.value, 0)
      this.feasibilityScore = this.selectedCriteriasScores.filter(item => item.type === 'Feasibility').reduce((partialSum, a) => partialSum + a.value, 0)

      if (this.requestData.scoreSheet) {
        if (this.requestData.scoreSheet.isRegulatoryRequirement) {
          this.overridingCriteriaControl.setValue("Regulatory Requirement")
          return
        }
        if (this.requestData.scoreSheet.isDubaiPlan) {
          this.overridingCriteriaControl.setValue("Leadership Directive/Dubai Plan 2030")
          return
        }
        this.overridingCriteriaControl.setValue("Other")
      }

    }
  }

  ngOnInit() {
  }


  onCriteriaScoreChange(e, criteria, optionValue) {
    if (this.selectedCriteriasScores.find(item => item.criteriaId == criteria.id)) {
      this.selectedCriteriasScores.splice(this.selectedCriteriasScores.findIndex(item => item.criteriaId == criteria.id), 1)
    }
    this.selectedCriteriasScores.push({ type: criteria.type, criteriaId: criteria.id, score: e.target.value, value: criteria.weight * optionValue / 100 })
    this.strategicFitScore = this.selectedCriteriasScores.filter(item => item.type === 'Strategic Fit').reduce((partialSum, a) => partialSum + a.value, 0)
    this.feasibilityScore = this.selectedCriteriasScores.filter(item => item.type === 'Feasibility').reduce((partialSum, a) => partialSum + a.value, 0)

    if (this.strategicFitScore + this.feasibilityScore <= 60) {
      this.priorityLevel = "Low"
      return
    }

    if (this.strategicFitScore + this.feasibilityScore > 60 && this.strategicFitScore + this.feasibilityScore < 80) {
      this.priorityLevel = "Medium"
      return
    }

    if (this.strategicFitScore + this.feasibilityScore >= 80) {
      this.priorityLevel = "High"
    }
  }

  onOverridingCriteriaChange() {
    if (this.overridingCriteriaControl.value === 'Other') {
      this.priorityLevel = "Low"
      return
    } else {
      this.resetCriteriaTableCheckboxes()
      this.priorityLevel = "High"
    }
  }

  resetCriteriaTableCheckboxes() {
    this.criterias.strategicFit = this.criterias.strategicFit.map(element => {
      return { ...element, value: null }
    })
    this.criterias.feasibility = this.criterias.feasibility.map(element => {
      return { ...element, value: null }
    })

    this.strategicFitScore = 0
    this.feasibilityScore = 0
    this.selectedCriteriasScores = []
  }

}
