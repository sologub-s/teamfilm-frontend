import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from './auth.service';
import { ValidatorsService } from './validators.service';

import 'rxjs/add/operator/switchMap';

@Component({
    selector: 'my-signupform',
    templateUrl: './signupform.component.html'
})
export class SignupformComponent implements OnInit {

    constructor(
        private authService : AuthService,
        private validatorsService : ValidatorsService
    ) {}

    public form: FormGroup;
    public control_email: FormControl;
    public email_loading: boolean = false;
    public control_password: FormControl;
    public control_confirmpassword: FormControl;
    public control_name: FormControl;
    public control_surname: FormControl;
    public control_nickname: FormControl;
    public nickname_loading: boolean = false;
    public control_agree: FormControl;
    public validator;
    public requestInProgress : boolean = false;
    @Output() onSubmitEmitter = new EventEmitter<any>();

    ngOnInit() {
        this.control_email = new FormControl('', [Validators.required, Validators.email]);
        this.control_password = new FormControl('', [Validators.minLength(4), Validators.required]);
        this.control_confirmpassword = new FormControl('', [Validators.required, Validators.minLength(4)]);
        this.control_name = new FormControl('', [Validators.required]);
        this.control_surname = new FormControl('', [Validators.required]);
        this.control_nickname = new FormControl('', [Validators.required]);
        this.control_agree = new FormControl(false);
        this.form = new FormGroup({
            email: this.control_email,
            password: this.control_password,
            confirmpassword: this.control_confirmpassword,
            name: this.control_name,
            surname: this.control_surname,
            nickname: this.control_nickname,
            agree: this.control_agree
        }, this.validatorsService.passwordsAreEqual('password', 'confirmpassword'));

        /**
         * Async validators
         */
        this.control_email.valueChanges.debounceTime(300).subscribe((changes) => {
            this.email_loading = true;
            this.validatorsService.uniqueEmail(this.control_email, changes).then(res => {
                this.email_loading = false;
            }, rej => { this.email_loading = false; });
        });
        this.control_nickname.valueChanges.debounceTime(300).subscribe((changes) => {
            this.nickname_loading = true;
            this.validatorsService.uniqueNickname(this.control_nickname, changes).then(res => {
                this.nickname_loading = false;
            }, rej => { this.nickname_loading = false; });
        });

        this.validator = () => {
            return {
                loading: this.email_loading || this.nickname_loading,
                valid: this.form.valid,

                email_loading: this.email_loading,
                nickname_loading: this.nickname_loading,

                email_has_error: this.control_email.invalid && this.control_email.dirty,
                email_has_success: this.control_email.valid && this.control_email.dirty,
                email_error_required: this.control_email.dirty && this.control_email.errors && this.control_email.errors['required'],
                email_error_email: this.control_email.dirty && this.control_email.errors && this.control_email.errors['email'],
                email_error_uniqueEmail: this.control_email.dirty && this.control_email.errors && this.control_email.errors['uniqueEmail'],
                email_show_remove: this.control_email.invalid && this.control_email.dirty && !this.email_loading,
                email_show_ok: this.control_email.valid && this.control_email.dirty && !this.email_loading,
                email_show_loading: this.control_email.dirty && this.email_loading,

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

                name_has_error: this.control_name.invalid && this.control_name.dirty,
                name_has_success: this.control_name.valid && this.control_name.dirty,
                name_error_required: this.control_name.dirty && this.control_name.errors && this.control_name.errors['required'],
                name_show_remove: this.control_name.invalid && this.control_name.dirty,
                name_show_ok: this.control_name.valid && this.control_name.dirty,

                surname_has_error: this.control_surname.invalid && this.control_surname.dirty,
                surname_has_success: this.control_surname.valid && this.control_surname.dirty,
                surname_error_required: this.control_surname.dirty && this.control_surname.errors && this.control_surname.errors['required'],
                surname_show_remove: this.control_surname.invalid && this.control_surname.dirty,
                surname_show_ok: this.control_surname.valid && this.control_surname.dirty,

                nickname_has_error: this.control_nickname.invalid && this.control_nickname.dirty,
                nickname_has_success: this.control_nickname.valid && this.control_nickname.dirty,
                nickname_error_required: this.control_nickname.dirty && this.control_nickname.errors && this.control_nickname.errors['required'],
                nickname_error_uniqueNickname: this.control_nickname.dirty && this.control_nickname.errors && this.control_nickname.errors['uniqueNickname'],
                nickname_show_remove: this.control_nickname.invalid && this.control_nickname.dirty && !this.nickname_loading,
                nickname_show_ok: this.control_nickname.valid && this.control_nickname.dirty && !this.nickname_loading,
                nickname_show_loading: this.control_nickname.dirty && this.nickname_loading,
            }
        };
    }

    onSubmit() {

        this.onSubmitEmitter.emit({status:'called'});

        if (!this.validator().valid) {
            return;
        }

        this.onSubmitEmitter.emit({status:'started'});

        window['$']('#sign_component_signupButton').button('loading');

        this.requestInProgress = true;
        setTimeout(() => {
            this.authService.signup(this.form.value.email, this.form.value.password, this.form.value.name, this.form.value.surname, this.form.value.nickname, this.form.value.agree).then((res) => {
                this.onSubmitEmitter.emit({status:200,navigateTo:'/activation'});
            }, rej => {
                switch (rej.status) {
                    case 400:
                        this.onSubmitEmitter.emit({status:400,custom_error_message:"Неправильные данные."});
                        break;
                    case 409:
                        this.onSubmitEmitter.emit({status:409,custom_error_message:"Такой email или nickname уже существуют."});
                        break;
                    default:
                        this.onSubmitEmitter.emit({status:null});
                        break;
                }
            }).then(() => { window['$']('#sign_component_signupButton').button('reset'); this.requestInProgress = false; this.form.reset(); });
        }, 3000);


    }

}