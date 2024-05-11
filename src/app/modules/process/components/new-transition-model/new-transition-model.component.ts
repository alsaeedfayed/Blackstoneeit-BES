import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { UsersService } from 'src/app/modules/users/users-service/users.service';

@Component({
  selector: 'app-new-transition-model',
  templateUrl: './new-transition-model.component.html',
  styleUrls: ['./new-transition-model.component.scss']
})
export class NewTransitionModelComponent implements OnInit {

  transitionForm: FormGroup;
  buttonColorOptions = [
    'Primary', 'Danger', 'Success', 'Secondary', 'Warning'
  ];
  roles: any[] = [];
  users: any[] = [];
  transitionTitleLanguage: string;
  buttonLabelLanguage: string;
  commentTileLanguage: string;
  destinationStates: any;

  @Input() language;
  @Input() selectedState;
  @Input() processData;
  
  @Output() onCancelAddTrans = new EventEmitter();
  @Output() onProcessReload = new EventEmitter();


  constructor(private fb: FormBuilder, private usersService: UsersService, private http: HttpHandlerService, private translate: TranslateService,
    private toastr: ToastrService) { }

  
  ngOnInit(): void {
    this.initializeForm();
    this.fetchRolesAndUsers();  

    if(this.language == 'en'){
      this.transitionTitleLanguage = 'english';
      this.buttonLabelLanguage = 'english';
      this.commentTileLanguage = 'english';
    }else if(this.language == 'ar'){
      this.transitionTitleLanguage = 'arabic';
      this.buttonLabelLanguage = 'arabic';
      this.commentTileLanguage = 'arabic';

    }       
    this.destinationStates =  this.processData?.states.map(state =>  ({title: state.title[this.language], id: state.id}));     
  }


  initializeForm(): void {
    this.transitionForm = this.fb.group({
      title: ['', Validators.required],
      arabicTitle: ['', Validators.required],
      fromStateId: [this.selectedState?.id, Validators.required],
      toStateId: ['', Validators.required],
      label: ['', Validators.required],
      arabicLabel: ['', Validators.required],
      buttonTag: ['', Validators.required], // for button color
      authorizationType: [1],
      roles: [{value: '', disabled: true}, Validators.required],
      users: [{value: '', disabled: true}, Validators.required],
      option: ['Single', Validators.required], // default value set to Single
      minVoteCount: [1],
      commentTag: [false], // checkbox
      commentTitle: [{value: '', disabled: true}, Validators.required],
      arabicCommentTitle: [{value: '', disabled: true}, Validators.required],
      isAttachmentRequired: [false], // checkbox
      // isActionVisibleExternally: [false] // checkbox
    });

    this.handleFormChanges();  
    this.transitionForm.valueChanges.subscribe(val =>{
      console.log(val);
      
    })  
  }

  handleFormChanges(): void {
    // Listen to changes in authorizationType to toggle allowedRoles and allowedUsers
    this.transitionForm.get('authorizationType').valueChanges.subscribe(value => {
      if (value === 'Role') {
        this.transitionForm.get('roles').enable();
        this.transitionForm.get('users').disable();
      } else if (value === 'User') {
        this.transitionForm.get('users').enable();
        this.transitionForm.get('roles').disable();
      } else {
        this.transitionForm.get('roles').disable();
        this.transitionForm.get('users').disable();
      }
    });

    // Listen to changes in commentTag to toggle commentTitle
    this.transitionForm.get('commentTag').valueChanges.subscribe(value => {
      if (value) {
        this.transitionForm.get('commentTitle').enable();
        this.transitionForm.get('arabicCommentTitle').enable();
      } else {
        this.transitionForm.get('commentTitle').disable();
        this.transitionForm.get('arabicCommentTitle').disable();
      }
    });
  }


  fetchRolesAndUsers(): void {
    this.http.get('/UserManagement/api/Role/GetAll?pageSize=30').subscribe(
      (roleData) => {
        this.roles = roleData?.data; 
      },
      (error) => {
      }
    );

    this.http.get('/UserManagement/api/User/GetAll?pageSize=30').subscribe(
      (userData) => {
        this.users = userData?.data; 
      },
      (error) => {
      }
    );
  }

  onRoleInputChange(e){
    this.http.get(`/UserManagement/api/Role/GetAll?roleName=${e.target.value}`).subscribe(
      (roleData) => {
        this.roles = roleData?.data; 
      },
      (error) => {
      }
    );
  }
  onUserInputChange(e){
    this.http.get(`/UserManagement/api/User/GetAll?FullName=${e.target.value}`).subscribe(
      (userData) => {
        this.users = userData?.data; 
      },
      (error) => {
      }
    );
  }

  addTransition(){
    if(this.transitionForm.valid){
      const body = {
         ...this.transitionForm.value,
         toStateId: this.transitionForm.value.toStateId.id,
          users: this.transitionForm?.value?.users?.map(user => ({id: user.id})),
           roles: this.transitionForm?.value?.roles?.map(role => ({id: role.id})),
           processId: this.processData.id
      }
      this.http.post(Config.transition.add, body).subscribe(
        (res) => {
          this.transitionForm.reset()
          this.onCancelAddTrans.emit()
          this.onProcessReload.emit()
          this.toastr.success(this.translate.instant('stateTransitions.addTransition.transitionSuccessAddedMsg'));
        },
        (error) => {
        });
    }
  }

  cancelAddTran(){
    this.onCancelAddTrans.emit()
  }

}
