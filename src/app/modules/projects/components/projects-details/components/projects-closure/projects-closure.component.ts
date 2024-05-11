import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { ProjectsService } from 'src/app/modules/projects/services/projects.service';

@Component({
  selector: 'app-projects-closure',
  templateUrl: './projects-closure.component.html',
  styleUrls: ['./projects-closure.component.scss']
})
export class ProjectsClosureComponent implements OnInit, OnChanges {
  @Input() projectData: any
  @Input() isPmo: boolean
  @Input() isPm: boolean
  mode: string = "card";
  questions: any = {};
  form: FormGroup;
  lang: string;
  items = [
    {
      title: { en: "Achieved", ar: "منجز" },
      code: "Yes"
    },
    {
      title: { en: "Not Achieved", ar: "لم يتحقق" },
      code: "No"
    },
  ]
  closureRequests: any;
  public isCollapsed: boolean[] = [];
  accordionActiveIds: string[] = []
  statusList: any;
  constructor(private projectsService: ProjectsService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private instantTranslator: TranslateService,
    private translationService: TranslateConfigService) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.projectData) {
      this.getClosureRequests(this.projectData.id)
      this.getStatus()
    }
  }

  ngOnInit() {
    this.lang = this.translationService.getSystemLang()
    this.handleLangChange()
    this.initClosureForm()
    this.getQuestions()
  }


  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
      this.form.reset()
      this.getQuestions()
    });
  }

  getClosureRequests(id) {
    this.projectsService.saveLoadingModalState(true)
    this.projectsService.getClosureRequests(id).subscribe(res => {
      this.closureRequests = res
      this.projectsService.saveLoadingModalState(false)
    })
  }

  getStatus() {
    this.projectsService.getClosureStatus().subscribe(res => {
      res && res.forEach(obj => {
        obj.name = obj?.title?.en;
        obj.nameAr = obj?.title?.ar;
      });

      this.statusList = res;
    });
  }

  getQuestions() {
    this.questions = []
    this.projectsService.getClosureQuestions().subscribe(res => {
      //Group questions based on category
      res.forEach((element, index) => {
        if (!element?.category)
          return
        this.form.addControl(element?.category?.title[this.lang], new FormArray([]))
        this.questions[element?.category?.title[this.lang]] = element.questions
      });
      Object.keys(this.questions).forEach((element, index) => {
        const currentCategoryControl: FormArray = this.form.controls[element] as FormArray
        this.questions[element].forEach(item => {
          currentCategoryControl.push(new FormGroup({
            id: new FormControl(item.id),
            question: new FormControl(null)
          }))
        });
      })
    })
  }

  onCreateClosureRequest() {

  }

  initClosureForm() {
    this.form = this.fb.group({
      status: [null, Validators.required],
      details: [null, Validators.required],
    });
  }

  onSubmitClosureRequest() {
    if (this.form.invalid) return;

    const answers = []


    Object.values(this.form.value).forEach((element: any) => {

      Array.isArray(element) && element.forEach(element => {
        if (element.question)
          answers.push({
            questionId: element.id,
            "answer": typeof element.question === 'object' ? undefined : element.question,
            "achieved": typeof element.question === 'object' ? (element.question.code === 'Achieved' ? true : false) : undefined
          })
      });
    });

    const requestData = {
      "projectId": this.projectData.id,
      "isDraft": false,
      "details": this.form.value.details,
      "answers": answers,
      "status": this.form.value.status,
    };

    this.projectsService.saveLoadingModalState(true);

    this.projectsService.submitCloserQuestions(requestData).subscribe(res => {
      this.toastr.success(this.instantTranslator.instant("projects.closureRequestSuccess"));
      this.projectsService.saveLoadingModalState(false);
      this.form.reset();
      this.getClosureRequests(this.projectData.id);
      this.mode = 'card';
    }, err => {
      this.projectsService.saveLoadingModalState(false);
      this.toastr.error(err.message);
    })
  }

  onCreateNewRequest() {
    this.mode = 'form';
  }

  onBackToList() {
    this.mode = 'card';
    this.form.reset();
  }

  get HasOpenRequests() {
    const openRequest = this.closureRequests?.find(request => !request.status.isFinal)
    if (openRequest) return true;
    return false;
  }

}
