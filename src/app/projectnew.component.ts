import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from './user.service';
import { ProjectService } from './project.service';
import { ValidatorsService } from './validators.service';

import 'rxjs/add/operator/switchMap';

@Component({
    selector: 'my-projectnew',
    templateUrl: './projectnew.component.html'
})
export class ProjectnewComponent implements OnInit {

    constructor(
        private router : Router,
        private userService : UserService,
        private projectService : ProjectService,
        private validatorsService : ValidatorsService
    ) {}

    public error_message : string = null;

    public form: FormGroup;
    public control_title: FormControl;
    public title_loading: boolean = false;
    public control_description: FormControl;

    public validator;
    public requestInProgress : boolean = false;
    @Output() onSubmitEmitter = new EventEmitter<any>();

    ngOnInit() {
        this.control_title = new FormControl('', [Validators.required]);
        this.control_description = new FormControl('', [Validators.required]);

        this.form = new FormGroup({
            title: this.control_title,
            description: this.control_description,
        });

        /**
         * Async validators
         */
        this.control_title.valueChanges.debounceTime(300).subscribe((changes) => {
            this.title_loading = true;
            this.validatorsService.uniqueProjectTitle(this.control_title, changes).then(res => {
                this.title_loading = false;
            }, rej => { this.title_loading = false; });
        });

        this.validator = () => {
            return {
                loading: this.title_loading,
                valid: this.form.valid,

                title_loading: this.title_loading,

                title_has_error: this.control_title.invalid && this.control_title.dirty,
                title_has_success: this.control_title.valid && this.control_title.dirty,
                title_error_required: this.control_title.dirty && this.control_title.errors && this.control_title.errors['required'],
                title_error_uniqueProjectTitle: this.control_title.dirty && this.control_title.errors && this.control_title.errors['uniqueProjectTitle'],
                title_show_remove: this.control_title.invalid && this.control_title.dirty && !this.title_loading,
                title_show_ok: this.control_title.valid && this.control_title.dirty && !this.title_loading,
                title_show_loading: this.control_title.dirty && this.title_loading,

                description_has_error: this.control_description.invalid && this.control_description.dirty,
                description_has_success: this.control_description.valid && this.control_description.dirty,
                description_error_required: this.control_description.dirty && this.control_description.errors && this.control_description.errors['required'],
                description_show_remove: this.control_description.invalid && this.control_description.dirty,
                description_show_ok: this.control_description.valid && this.control_description.dirty,
            }
        };
    }

    onSubmit() {

        //this.onSubmitEmitter.emit({status:'called'});
        this.error_message = null;

        if (!this.validator().valid) {
            return;
        }

        this.error_message = null;

        window['$']('#projectnew_submitButton').button('loading');

        this.requestInProgress = true;
        this.projectService.create(this.userService.currentUser.value.id, this.form.value.title, this.form.value.description).then((res) => {
            //this.router.navigateByUrl(`/my/project/${res.json().project.id}`);
            console.log(`/my/project/${res.json().project.id}`);
            this.onSubmitEmitter.emit({status:200,project:res.json().project});
        }, rej => {
            switch (rej.status) {
                case 0:
                    this.error_message = "Связь с сервером отсутствует. Пожалуйста, перезагрузите страницу и попробуйте позже.";
                    break;
                case 400:
                    this.onSubmitEmitter.emit({status:400,custom_error_message:"Неправильные данные."});
                    break;
                case 403:
                    this.error_message = "Логин или пароль указаны неверно";
                    //this.error_message = "Пользователь с таким email не найден.";
                    break;
                case 409:
                    this.error_message = "Такой title уже существует.";
                    break;
                case 500:
                    this.error_message = "На сервере произошла ошибка. Пожалуйста, перезагрузите страницу и попробуйте позже.";
                    break;
                default:
                    this.error_message = "Неизвестная ошибка. Пожалуйста, перезагрузите страницу и попробуйте позже.";
                    break;
            }
        }).then(() => {
            window['$']('#projectnew_submitButton').button('reset');
            setTimeout(() => {
                window['$']('#projectnew_submitButton').prop('disabled', true);
            }, 0);
            this.requestInProgress = false;
            this.form.reset();
        });


    }

}