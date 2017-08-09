import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from './user.service';

import 'rxjs/add/operator/switchMap';

@Component({
    selector: 'my-resetpasswordrequestform',
    templateUrl: './resetpasswordrequestform.component.html'
})
export class ResetpasswordrequestformComponent implements OnInit {

    constructor(
        private userService : UserService
    ) {}

    public form: FormGroup;
    public control_email: FormControl;
    public validator;
    public requestInProgress : boolean = false;
    @Output() onSubmitEmitter = new EventEmitter<any>();

    ngOnInit() {
        this.control_email = new FormControl('', [Validators.required, Validators.email]);
        this.form = new FormGroup({
            email: this.control_email
        });
        this.validator = () => {
            return {
                valid: this.form.valid,

                email_has_error: this.control_email.invalid && this.control_email.dirty,
                email_has_success: this.control_email.valid && this.control_email.dirty,
                email_error_required: this.control_email.dirty && this.control_email.errors && this.control_email.errors['required'],
                email_error_email: this.control_email.dirty && this.control_email.errors && this.control_email.errors['email'],
                email_show_remove: this.control_email.invalid && this.control_email.dirty,
                email_show_ok: this.control_email.valid && this.control_email.dirty
            }
        };
    }

    onSubmit() {

        this.onSubmitEmitter.emit({status:'called'});

        if (!this.validator().valid) {
            return;
        }

        this.onSubmitEmitter.emit({status:'started'});

        window['$']('#resetpasswordrequest_component_resetpasswordrequestButton').button('loading');

        this.requestInProgress = true;

        this.userService.resetpasswordrequest(this.form.value.email).then(res => {
            this.onSubmitEmitter.emit({status:200,navigateTo:'/resetpasswordverification'});
        }, rej => {
            switch (rej.status) {
                case 404:
                    this.onSubmitEmitter.emit({status:404,custom_error_message:"Пользователь с таким email не найден."});
                    break;
                default:
                    this.onSubmitEmitter.emit({status:null});
                    break;
            }
        }).then(() => { window['$']('#resetpasswordrequest_component_resetpasswordrequestButton').button('reset'); this.requestInProgress = false; this.form.reset(); });


    }

}