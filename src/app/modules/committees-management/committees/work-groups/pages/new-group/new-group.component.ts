import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-group',
  templateUrl: './new-group.component.html',
  styleUrls: ['./new-group.component.scss']
})
export class NewGroupComponent extends ComponentBase implements OnInit {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;
  gettingEmployees: boolean = false;
  employeeLoadCount: number = 1;
  users: any;

  // loading vars
  loadingCommitteeDetails: boolean = true;
  loadingData: boolean = true;
  membersLoading: boolean = true;
  selectedGroupMembers: any[] = []; 



  isSaveDraftBtnLoading: boolean = false;
  isUpdating: boolean = false;
  form: FormGroup;
  committeeMembers: any[] = [];
  committeeId: any = null;
  groupId: any = null;
  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private fb: FormBuilder,
    private httpSer: HttpHandlerService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
  ) {
    super(translateService, translate);
  }

  ngOnInit(): void {
    //check valid ids
    this.checkId();
    this.getUsers();
    // this.initNewGroupFormControls();
  }
  // check if in update page
  checkId() {
    //check committee id
    this.committeeId = +this.route.snapshot.paramMap.get('committeeId');
    if (isNaN(this.committeeId)) {
      this.goToNotFound();
      this.committeeId = null;
    } else {
      // check update
      if (this.router.url.includes('/update/')) {
        //edit case
        this.groupId = +this.route.snapshot.paramMap.get('groupId');
        if (isNaN(this.groupId)) {
          this.goToNotFound();
          this.groupId = null;
        } else {
          this.isUpdating = true;

          //get group details
          this.getGroupDetails();
        }
      }
      // handles language change event
      this.handleLangChange();

      // initialize new group form controls
      this.initNewGroupFormControls();

      // get Committee details
      this.GetCommitteeDetails();
    }
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });
  }

  //get committee users
  getEmployees() {
    this.gettingEmployees = true;
    let path = Config.CommitteesManagement.GetUsers.replace('{id}', `${this.committeeId}`);
    this.httpSer
      .get(path, { pageIndex: this.employeeLoadCount, pageSize: 10 })
      .pipe(finalize(() => (this.gettingEmployees = false)))
      .subscribe((res) => {
        if (res) {
          // this.committeeMembers = res.data;
          res.data.forEach((emp) => {
            let duplicated = false;

            //check if duplicated employee exists
            for (const e of this.committeeMembers) {
              if (e.id == emp.id) {
                duplicated = true;
                break;
              }
            }
            if (!duplicated) this.committeeMembers.push(emp);
          });
        }
      });
  }


  getUsers() {
    this.httpSer.get('/UserManagement/api/User/GetAll').subscribe(
      (usersData) => {        
        this.users = usersData.data
        
      },
      (error) => {
      }
    );
  }



  //focus on search bar if members selection

  onFocus() {
    this.getEmployees();
  }
  //load more employees
  loadMoreEmployees() {
    this.employeeLoadCount++;
    this.getEmployees();
  }
  //fetch a slice of  users
  getUsersSlice() {
    if (this.form.value.memberIds.length <= 0) return;
    this.httpSer
      .post(Config.UserManagement.GetUsersByIds, { usersIds: this.form.value.memberIds })
      .pipe(finalize(() => (this.membersLoading = false)))
      .subscribe((res) => {
        if (res) {
          res.activeUsers.forEach((emp) => {
            let duplicated = false
            //check if duplicated employee exists
            for (const e of this.committeeMembers) {
              if (e.id == emp.id) {
                duplicated = true;
                break;
              }
            }
            if (!duplicated) this.committeeMembers.push(emp);
          });
        }
      });
  }
  // get committee details
  GetCommitteeDetails() {
    this.httpSer
      .get(`${Config.CommitteesManagement.GetCommitteeDetails}/${this.committeeId}`)
      .pipe(finalize(() => { this.loadingCommitteeDetails = false; }))
      .subscribe((res) => {
        if (res) {          
          if (res.status == 1) {
            this.router.navigateByUrl(`/committees-management/requests`);
          }
        } else this.goToNotFound();
      });
  }
  //Get group details
  getGroupDetails() {
    this.httpSer
      .get(`${Config.WorkGroup.GetGroupDetails}/${this.groupId}`)
      .pipe(finalize(() => { this.loadingData = false; }))
      .subscribe((res) => {                

        this.form.patchValue({
          name: res.name,
          memberIds: res.memberIds,
          supportMemberIds: res.supportMemberIds 
        });
        this.getUsersSlice();
      })
  }

  // initialize new group form controls
  initNewGroupFormControls() {
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(100)]],
      memberIds: [null, Validators.required],
      supportMemberIds: [null], 
    });

    this.form.get('memberIds').valueChanges.subscribe((selectedMembers) => {
      this.selectedGroupMembers = selectedMembers;
    });
  }

  // back to last page
  backToLastPage() {
    if (this.isUpdating) this.goToDetailsPage();
    else this.router.navigateByUrl(`/committees-management/committee-details/${this.committeeId}/work-groups`);
  }

  // create new group
  createGroup() {
    const body = {
      committeeId: this.committeeId,
      ...this.form.value,
    };
    this.httpSer
      .post(Config.WorkGroup.Create, body)
      // change to btn loading
      .subscribe((res) => {
        if (res) {
          this.toastr.success(this.translate.instant('committeeNewGroup.createSuccessMsg'));
          this.router.navigateByUrl(`/committees-management/committee-details/${this.committeeId}/work-groups`);
        }
      });
  }

  // Edit group
  updateGroup() {
    const body = {
      id: this.groupId,
      ...this.form.value,
    };

    // else body.id = +this.groupId
    this.httpSer
      .put(Config.WorkGroup.Update, body)
      .subscribe((res) => {
        if (res) {
          this.toastr.success(this.translate.instant('committeeNewGroup.updateSuccessMsg'));
          this.router.navigateByUrl(`/committees-management/committee/${this.committeeId}/groups/${this.groupId}`);
        }
      });
  }

  goToNotFound() {
    this.router.navigateByUrl(`/oops/not-found`);
  }

  goToDetailsPage() {
    let path = (`/committees-management/committee/${this.committeeId}/groups/${this.groupId}`);
    this.router.navigateByUrl(path);
  }

}
