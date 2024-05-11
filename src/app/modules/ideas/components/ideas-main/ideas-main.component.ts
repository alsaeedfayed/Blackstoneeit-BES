import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'src/app/core/services/translate.service';
import { PopupService } from 'src/app/shared/popup/popup.service';
import { IdeasService } from '../../services/ideas.service';

@Component({
  selector: 'app-ideas-main',
  templateUrl: './ideas-main.component.html',
  styleUrls: ['./ideas-main.component.scss']
})
export class IdeasMainComponent implements OnInit {
  ideas: any
  ideasTotal: number
  searchModel = {
    keyword: null,
    sortBy: null,
    page: 1,
    pageSize: 6
  }
  lang: any;
  sortItems: any = [
    {
      title: {
        en: 'Newest',
        ar: 'الأحدث',
      },
      isDefault: true
    },
    {
      title: {
        en: 'Oldest',
        ar: 'الأقدم',
      },
      isDefault: false
    },
    {
      title: {
        en: 'Last updated',
        ar: 'آخر تحديث',
      },
      isDefault: false
    },
  ]
  loading: boolean
  constructor(private ideasService: IdeasService, private translationService: TranslationService, private popupService: PopupService) { }

  ngOnInit(): void {
    this.lang = this.translationService.language
    this.getAllIdeas(this.searchModel)
  }


  getAllIdeas(searchModel) {
    this.loading = true
    this.ideasService.getIdeas(searchModel).subscribe(res => {
      this.ideas = res.data
      this.ideasTotal = res.total
      this.loading = false
    })
  }

  onCreateIdea() {
    this.popupService.open("ideas")
    this.ideasService.saveModalConfig({
      title: "Create Idea",
      mode: "idea-form"
    })
  }


  onSearch(e) {

  }
  onSort(e) {

  }
  onAssignedToMeChange(e) {

  }
}
