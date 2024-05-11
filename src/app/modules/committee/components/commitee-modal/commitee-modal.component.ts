import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
  AfterViewInit,
  OnChanges
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {finalize} from 'rxjs/operators';
import {Config} from 'src/app/core/config/api.config';
import {EnglishLettersAndNumbersOnly} from 'src/app/core/helpers/English-Letters-And-Numbers-Only.validator';
import {ArabicLettersAndNumbersOnly} from 'src/app/core/helpers/Arabic-Letters-And-Numbers-Only.validator';
import {HttpHandlerService} from 'src/app/core/services/http-handler.service';
import {
  RequestsCreateService
} from 'src/app/modules/project-initiation/components/requests-create/services/requests.service';
import {ModelService} from 'src/app/shared/components/model/model.service';
import {TeamSearchComponent} from 'src/app/shared/components/team-search/team-search.component';

@Component({
  selector: 'commitee-modal',
  templateUrl: './commitee-modal.component.html',
  styleUrls: ['./commitee-modal.component.scss']
})

export class CommitteeModalComponent implements OnInit, OnChanges {

  isFormSubmitted = false;
  loading = false;
  isBtnLoading = false;
  @ViewChild(TeamSearchComponent) teamSearchComponent;
  @Input() id;
  @Output() submitted = new EventEmitter();
  committeesForm: FormGroup = new FormGroup({});
  committee;
  oldChairMan: any;
  userPaginationModel: any = {
    pageIndex: 1,
    pageSize: 1000,
  };
  language: string = this.translate.currentLang;
  users = [];

  constructor(private modelService: ModelService,
              private toastr: ToastrService,
              private translate: TranslateService,
              private fb: FormBuilder,
              private httpHandlerService: HttpHandlerService,
              private requestsService: RequestsCreateService) {

  }

  ngOnChanges() {
    if (this.users.length > 1) {
      this.getCommitteeById(this.id);
    }
  }

  ngOnInit(): void {
    // this.language = this.translate.currentLang;
    this.committeesForm = this.fb.group({
      name: this.fb.control('', [
        Validators.required,
        EnglishLettersAndNumbersOnly(),
      ]),
      nameAr: this.fb.control('', [
        Validators.required,
        ArabicLettersAndNumbersOnly(),
      ]),
      chairmanId: this.fb.control(null, Validators.required),
      members: this.fb.array([])
    })
    this.getUsers(this.userPaginationModel);
    this.handleLangChange();

    this.modelService.closeModel$.subscribe((data) => {
      if (!this.committee) {
        this.committeesForm.reset();
      }
    });
  }

  handleSelectChairman(chairman) {
    let chairmanPerson = this.users.filter(user => {
      return user.id == chairman.id
    })[0];

    if (this.teamSearchComponent.selectedMembers && this.teamSearchComponent.selectedMembers.length > 0) {
      this.teamSearchComponent.selectedMembers.forEach(selectedMember => {

        if (selectedMember.id != chairman.id) {
          chairmanPerson.checked = true;
          chairmanPerson.disabled = true;
          selectedMember.disabled = false;
          //  this.teamSearchComponent.selectedMembers.push(chairmanPerson);
          if (!this.teamSearchComponent.selectedMembers.includes(chairmanPerson)) {          //checking weather array contain the id
            this.teamSearchComponent.selectedMembers.push(chairmanPerson);               //adding to array because value doesnt exists
          } else {
            this.teamSearchComponent.selectedMembers.splice(chairmanPerson.indexOf(chairmanPerson), 1);  //deleting
          }

        } else {
          //  debugger
          chairmanPerson.checked = true;
          chairmanPerson.disabled = true;
          // selectedMember.disabled = false;
        }
      });
      this.oldChairMan = chairmanPerson;
    } else {
      chairmanPerson.checked = true;
      chairmanPerson.disabled = true;
      if (!this.teamSearchComponent.selectedMembers.includes(chairmanPerson)) {          //checking weather array contain the id
        this.teamSearchComponent.selectedMembers.push(chairmanPerson);               //adding to array because value doesnt exists
      } else {
        this.teamSearchComponent.selectedMembers.splice(chairmanPerson.indexOf(chairmanPerson), 1);  //deleting
      }
      // this.teamSearchComponent.selectedMembers.push(chairmanPerson);
      this.oldChairMan = chairmanPerson;
    }
  }

  handleSelectChairman2(chairman) {
    // Find the chairman in the users list
    let chairmanPerson = this.users.find(user => user.id === chairman.id);

    if (!chairmanPerson) {
      // Chairman not found, handle the error or return
      return;
    }

    // Disable the old chairman if it exists in the selectedMembers list
    if (this.oldChairMan && this.teamSearchComponent.selectedMembers.includes(this.oldChairMan)) {
      this.oldChairMan.disabled = false;
      this.oldChairMan.checked = false;
      this.teamSearchComponent.selectedMembers = this.teamSearchComponent.selectedMembers.filter(
        member => member.id !== this.oldChairMan.id
      );
    }

    // Update the chairman status
    chairmanPerson.checked = true;
    chairmanPerson.disabled = true;

    // Update the selected members list
    if (!this.teamSearchComponent.selectedMembers.includes(chairmanPerson)) {
      this.teamSearchComponent.selectedMembers.push(chairmanPerson);
    }

    // Save the current chairman as the old chairman
    this.oldChairMan = chairmanPerson;
  }

  getCommitteeById(id) {
    if (this.teamSearchComponent) {
      this.teamSearchComponent.selectedMembers = [];
    }
    this.httpHandlerService
      .get(`${Config.Committees.Get}/${id}`).subscribe(data => {
      this.committee = data;
      this.committeesForm.get('name').setValue(this.committee.name);
      this.committeesForm.get('nameAr').setValue(this.committee.nameAr);
      this.committeesForm.get('chairmanId').setValue(this.committee.chairmanId);


      this.committee.members.forEach(member => {
        let committee = this.users.filter(user => {
          return user.id == member
        })[0];
        //debugger
        if (committee) {
          committee.checked = true;
          this.teamSearchComponent.selectedMembers.push(committee);
        }
        if (this.committee.chairmanId == member) {
          committee.disabled = true;
          this.oldChairMan = committee
        }
      });
      this.users = this.users.sort((a, b) => b.checked - a.checked);
    })
  }

  handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.language = language.lang;
      this.getUsers(this.userPaginationModel);
    });
  }

  submit() {
    this.isFormSubmitted = true;
    this.committeesForm.controls['members'].setValue([]);
    this.teamSearchComponent.selectedMembers.forEach(element => {
      this.committeesForm.controls['members'].value.push(new FormControl(element.id))
    });
    if (this.committeesForm.valid) {
      this.isBtnLoading = true;
      if (this.committee) {
        this.httpHandlerService
          .put(Config.Committees.Update, {
            id: this.id,
            name: this.committeesForm.value.name,
            nameAr: this.committeesForm.value.nameAr,
            chairmanId: this.committeesForm.value.chairmanId,
            members: this.committeesForm.value.members.map(member => {
              return member.value
            }),
          })
          .pipe(finalize(() => (this.isBtnLoading = false)))
          .subscribe((res) => {
            if (res) {
              this.toastr.success(this.translate.instant('committee.updated'));
              this.closePopup();
              this.submitted.emit();
            }
          });
      } else {
        this.httpHandlerService
          .post(Config.Committees.Create, {
            name: this.committeesForm.value.name,
            nameAr: this.committeesForm.value.nameAr,
            chairmanId: this.committeesForm.value.chairmanId,
            members: this.committeesForm.value.members.map(member => {
              return member.value
            }),
          })
          .pipe(finalize(() => (this.isBtnLoading = false)))
          .subscribe((res) => {
            if (res) {
              this.toastr.success(this.translate.instant('committee.added'));
              this.closePopup();
              this.submitted.emit();
              this.committeesForm.reset();
              this.teamSearchComponent.selectedMembers = [];
              this.teamSearchComponent.uncheckAll();
            }
          });
      }
    }
  }


  getUsers(searchModel) {
    this.loading = true;
    this.requestsService.getUsers(searchModel).subscribe(res => {
      this.users = res.data;

      for (let i = 0; i < this.users.length; i++) {
        this.users[i].checked = false;
      }

      this.loading = false;

      if (this.id) {
        this.getCommitteeById(this.id);
      }
    }, err => {
    })
  }

  closePopup() {
    this.modelService.close();
  }

}
