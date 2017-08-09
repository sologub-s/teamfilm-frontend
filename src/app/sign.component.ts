import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute }   from '@angular/router';

import { SigninformComponent } from './signinform.component';
import { SignupformComponent } from './signupform.component';
import { ActivationformComponent } from './activationform.component';
import { ResetpasswordrequestformComponent } from "./resetpasswordrequestform.component";
import { ResetpasswordverificationformComponent } from "./resetpasswordverificationform.component";

@Component({
    selector: 'sign',
    templateUrl: './sign.component.html'
})
export class SignComponent implements OnInit {

    @ViewChild(SigninformComponent)
    private signinForm: SigninformComponent;

    @ViewChild(SignupformComponent)
    private signupForm: SignupformComponent;

    @ViewChild(ActivationformComponent)
    private activationForm: ActivationformComponent;

    @ViewChild(ResetpasswordrequestformComponent)
    private resetpasswordrequestForm: ResetpasswordrequestformComponent;

    @ViewChild(ResetpasswordverificationformComponent)
    private resetpasswordverificationForm: ResetpasswordverificationformComponent;

    constructor(
        private router: Router,
        private activatedRoute : ActivatedRoute
    ) { }

    public display_mode : string;
    public error_message : string = null;

    ngOnInit() {
        this.activatedRoute.url.subscribe((value) => {
            this.display_mode = value[0].path;
        });

        setTimeout(() => {
            if ([
                    'signin',
                    'signup',
                    'resetpasswordrequest',
                    'resetpasswordverification',
                    'resetpasswordverification/:token',
                    'activation',
                    'activation/:token'
                ].indexOf(this.display_mode) < 0) {
                return;
            }
            this[`${this.display_mode}Form`].onSubmitEmitter.subscribe((message) => {
                switch (message.status) {
                    case 'called':
                        break;
                    case 'started':
                        this.error_message = null;
                        break;
                    case 200:
                        this.router.navigateByUrl(message.navigateTo);
                        break;
                    case 0:
                        this.error_message = "Связь с сервером отсутствует. Пожалуйста, перезагрузите страницу и попробуйте позже.";
                        break;
                    case 500:
                        this.error_message = "На сервере произошла ошибка. Пожалуйста, перезагрузите страницу и попробуйте позже.";
                        break;
                    case 403:
                        this.error_message = "Логин или пароль указаны неверно";
                        //this.error_message = "Пользователь с таким email не найден.";
                        break;
                    default:
                        this.error_message = message.custom_error_message ? message.custom_error_message : "Неизвестная ошибка. Пожалуйста, перезагрузите страницу и попробуйте позже.";
                        break;
                }
            })
        }, 0);
    }
}