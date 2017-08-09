import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

import 'rxjs/add/operator/switchMap';

@Component({
    selector: 'my-signinform',
    templateUrl: './signinform.component.html'
})
export class SigninformComponent implements OnInit {

    constructor(
        private authService : AuthService
    ) {}

    public form: FormGroup;
    public control_email: FormControl;
    public control_password: FormControl;
    public validator;
    public requestInProgress : boolean = false;
    @Output() onSubmitEmitter = new EventEmitter<any>();

    ngOnInit() {
        this.control_email = new FormControl('', [Validators.required, Validators.email]);
        this.control_password = new FormControl('', [Validators.minLength(4), Validators.required]);
        this.form = new FormGroup({
            email: this.control_email,
            password: this.control_password
        });
        this.validator = () => {
            return {
                valid: this.form.valid,

                email_has_error: this.control_email.invalid && this.control_email.dirty,
                email_has_success: this.control_email.valid && this.control_email.dirty,
                email_error_required: this.control_email.dirty && this.control_email.errors && this.control_email.errors['required'],
                email_error_email: this.control_email.dirty && this.control_email.errors && this.control_email.errors['email'],
                email_show_remove: this.control_email.invalid && this.control_email.dirty,
                email_show_ok: this.control_email.valid && this.control_email.dirty,

                password_has_error: this.control_password.invalid && this.control_password.dirty,
                password_has_success: this.control_password.valid && this.control_password.dirty,
                password_error_required: this.control_password.dirty && this.control_password.errors && this.control_password.errors['required'],
                password_error_minlength: this.control_password.dirty && this.control_password.errors && this.control_password.errors['minlength'],
                password_show_remove: this.control_password.invalid && this.control_password.dirty,
                password_show_ok: this.control_password.valid && this.control_password.dirty
            }
        };
    }

    onSubmit() {

        this.onSubmitEmitter.emit({status:'called'});

        if (!this.validator().valid) {
            return;
        }

        this.onSubmitEmitter.emit({status:'started'});

        window['$']('#sign_component_loginButton').button('loading');

        this.requestInProgress = true;

        this.authService.login(this.form.value.email, this.form.value.password).then((res) => {
            this.onSubmitEmitter.emit({status:200,navigateTo:'/my/profile'});
        }, rej => {
            switch (rej.status) {
                case 403:
                    this.onSubmitEmitter.emit({status:403,custom_error_message:"Логин или пароль указаны неверно либо учетная запись не активирована"});
                    break;
                default:
                    this.onSubmitEmitter.emit({status:null});
                    break;
            }
        }).then(() => { window['$']('#sign_component_loginButton').button('reset'); this.requestInProgress = false; this.form.reset(); });


    }

}