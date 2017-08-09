/**
 * Created by zeitgeist on 7/7/17.
 */
import { Injectable } from '@angular/core';

import {ValidationErrors, ValidatorFn, AbstractControl, FormGroup, FormControl} from '@angular/forms';

import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class ValidatorsService {

    constructor(private authService: AuthService) { }

    /**
     * Validator that performs nickname validation.
     */
    nickname(control: AbstractControl): ValidationErrors | null {
        return control.value === 'Zeit' ? null : {
            nickname: {
                valid: false
            }
        };
    }

    cellphone(control: AbstractControl): ValidationErrors | null {
        return control.value === null || control.value === '' || control.value.match(/^\+380[0-9]{9}$/i) ? null : {
            cellphone: {
                valid: false
            }
        };
    }

    sex(control: AbstractControl): ValidationErrors | null {
        return control.value === 'null_value' || ['m','w'].indexOf(control.value) > -1 ? null : {
            sex: {
                valid: false
            }
        };
    }

    passwordsAreEqual(key1, key2) {

        return (group: FormGroup): {[key: string]: any} => {
            let control1 = group.controls[key1];
            let control2 = group.controls[key2];

            if (control1.value !== control2.value) {
                return {
                    passwordsAreEqual: {
                        valid: false
                    }
                };
            }
        }
    }

    uniqueEmail(control: FormControl, value): Promise<any> {

        if (control.errors && control.errors['uniqueEmail']) {
            delete control.errors['uniqueEmail'];
        }

        if (!value) {
            return Promise.reject(null);
        }

        return this.authService.getEmailExist(value).then(res => {
            if (res.json().emailExist) {
                control.setErrors(Object.assign(control.errors ? control.errors : {}, {uniqueEmail:true}));
            }
        });
    }

    uniqueNickname(control: FormControl, value): Promise<any> {

        if (control.errors && control.errors['uniqueNickname']) {
            delete control.errors['uniqueNickname'];
        }

        if (!value) {
            return Promise.reject(null);
        }

        return this.authService.getNicknameExist(value).then(res => {
            if (res.json().nicknameExist) {
                control.setErrors(Object.assign(control.errors ? control.errors : {}, {uniqueNickname:true}));
            }
        });
    }
}