import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from './auth.service';
import { ValidatorsService } from './validators.service';

import 'rxjs/add/operator/switchMap';

@Component({
    selector: 'my-resetpasswordverificationform',
    templateUrl: './resetpasswordverificationform.component.html'
})
export class ResetpasswordverificationformComponent implements OnInit {

    constructor(
        private authService : AuthService,
        private validatorsService : ValidatorsService,
        private activatedRoute : ActivatedRoute
    ) {}

    public form: FormGroup;
    public control_token: FormControl;
    public control_password: FormControl;
    public control_confirmpassword: FormControl;
    public validator;
    public requestInProgress : boolean = false;
    @Output() onSubmitEmitter = new EventEmitter<any>();

    ngOnInit() {
        this.control_token = new FormControl('', [Validators.required]);
        this.control_password = new FormControl('', [Validators.required, Validators.minLength(4)]);
        this.control_confirmpassword = new FormControl('', [Validators.required, Validators.minLength(4)]);
        this.form = new FormGroup({
            token: this.control_token,
            password: this.control_password,
            confirmpassword: this.control_confirmpassword,
        }, this.validatorsService.passwordsAreEqual('password', 'confirmpassword'));
        this.validator = () => {
            return {
                valid: this.form.valid,

                token_has_error: this.control_token.invalid && this.control_token.dirty,
                token_has_success: this.control_token.valid && this.control_token.dirty,
                token_error_required: this.control_token.dirty && this.control_token.errors && this.control_token.errors['required'],
                token_show_remove: this.control_token.invalid && this.control_token.dirty,
                token_show_ok: this.control_token.valid && this.control_token.dirty,

                password_has_error: this.control_password.invalid && this.control_password.dirty || (this.form.errors !== null && this.form.errors['passwordsAreEqual']),
                password_has_success: this.control_password.valid && this.control_password.dirty && !(this.form.errors !== null && this.form.errors['passwordsAreEqual']),
                password_error_required: this.control_password.dirty && this.control_password.errors && this.control_password.errors['required'],
                password_error_minlength: this.control_password.dirty && this.control_password.errors && this.control_password.errors['minlength'],
                password_error_passwordsAreEqual: this.control_password.dirty && (this.form.errors !== null && this.form.errors['passwordsAreEqual']),
                password_show_remove: this.control_password.invalid && this.control_password.dirty || (this.form.errors !== null && this.form.errors['passwordsAreEqual']),
                password_show_ok: this.control_password.valid && this.control_password.dirty && !(this.form.errors !== null && this.form.errors['passwordsAreEqual']),

                confirmpassword_has_error: this.control_confirmpassword.invalid && this.control_confirmpassword.dirty || (this.form.errors !== null && this.form.errors['passwordsAreEqual']),
                confirmpassword_has_success: this.control_confirmpassword.valid && this.control_confirmpassword.dirty && !(this.form.errors !== null && this.form.errors['passwordsAreEqual']),
                confirmpassword_error_required: this.control_confirmpassword.dirty && this.control_confirmpassword.errors && this.control_confirmpassword.errors['required'],
                confirmpassword_error_minlength: this.control_confirmpassword.dirty && this.control_confirmpassword.errors && this.control_confirmpassword.errors['minlength'],
                confirmpassword_error_passwordsAreEqual: this.control_confirmpassword.dirty && (this.form.errors !== null && this.form.errors['passwordsAreEqual']),
                confirmpassword_show_remove: this.control_confirmpassword.invalid && this.control_confirmpassword.dirty || (this.form.errors !== null && this.form.errors['passwordsAreEqual']),
                confirmpassword_show_ok: this.control_confirmpassword.valid && this.control_confirmpassword.dirty && !(this.form.errors !== null && this.form.errors['passwordsAreEqual']),
            }
        };

        this.activatedRoute.params.subscribe( params => {
            if (params['token']) {
                this.control_token.patchValue(params['token']);
                this.control_token.markAsDirty();
                this.control_token.markAsTouched();
            }
        });
    }

    onSubmit() {

        this.onSubmitEmitter.emit({status:'called'});

        if (!this.validator().valid) {
            return;
        }

        this.onSubmitEmitter.emit({status:'started'});

        window['$']('#resetpasswordverification_component_resetpasswordverificationButton').button('loading');

        this.requestInProgress = true;

        this.authService.resetpasswordverification(this.form.value.token, this.form.value.password).then(res => {
            this.onSubmitEmitter.emit({status:200,navigateTo:'/signin'});
        }, rej => {
            switch (rej.status) {
                case 404:
                    this.onSubmitEmitter.emit({status:404,custom_error_message:"Кодовая фраза не действительна или просрочена."});
                    break;
                default:
                    this.onSubmitEmitter.emit({status:null});
                    break;
            }
        }).then(() => { window['$']('#resetpasswordverification_component_resetpasswordverificationButton').button('reset'); this.requestInProgress = false; this.form.reset(); });


    }

}