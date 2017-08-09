import {Injectable} from '@angular/core';

import 'rxjs/add/operator/toPromise';
import { BehaviorSubject } from 'rxjs/Rx';

import { ApiService } from './api.service';

@Injectable()
export class AuthService {

    public loginUrl = '/user/login';
    public logoutUrl = '/user/logout';
    public signupUrl = '/user';
    public updateUrl = '/user';
    public getByUrl = '/user/by';
    public getEmailExistUrl = '/user/email/exist';
    public getNicknameExistUrl = '/user/nickname/exist';
    public activationUrl = '/user/activate';
    public resetpasswordrequestUrl = '/user/resetpasswordrequest';
    public resetpasswordverificationUrl = '/user/resetpasswordverification';
    public userUrl = '/user';

    constructor(private apiService: ApiService) { }

    public loadUser (id : string) : Promise<any> {
        return this.apiService
            .get(`${this.userUrl}/${id}`)
            .then(res => {
                this.user.next(res.json().user);
            });
    }

    private authority = new BehaviorSubject(
        localStorage.getItem('authority')
            ? JSON.parse(localStorage.getItem('authority'))
            : null);

    public user = new BehaviorSubject(null);

    private authorized = new BehaviorSubject(false);

    getAccessToken () : string {
        return this.authority.value ? this.authority.value.access_token : null;
    }

    public isAuthorizedAndLoaded : boolean = this.authorized.getValue() && this.user.getValue();

    setAuthorizedNext(value : boolean) {
        this.authorized.next(value);
    }

    public initSession () {
        this.authority.subscribe((value: any) => {
            if (value) {
                this.setAuthorizedNext(true);
                localStorage.setItem('authority', JSON.stringify(value));
                this.apiService.setAccessToken(value.access_token);
                this.loadUser(value.user_id).then((res) => {
                }, rej => {
                    //this.uninstallAuthority();
                    this.uninstallAuthority();
                });
            } else {
                //this.uninstallAuthority();
                this.uninstallAuthority();
            }
        });
    }

    public uninstallAuthority() {
        this.setAuthorizedNext(false);
        localStorage.removeItem('authority');
        this.apiService.setAccessToken(null);
        this.user.next(null);
    }

    public getEmailExist (value : string) : Promise<any> {
        return this.apiService.get(`${this.getEmailExistUrl}/${value}`)
            .then(res => {
                console.warn('resolve auth.service / getEmailExist', res);
                return Promise.resolve(res);
            }, rej => {
                console.warn('reject auth.service / getEmailExist', rej);
                return Promise.reject(rej);
            });
    }

    public getNicknameExist (value : string) : Promise<any> {
        return this.apiService.get(`${this.getNicknameExistUrl}/${value}`)
            .then(res => {
                console.warn('resolve auth.service / getNicknameExist', res);
                return Promise.resolve(res);
            }, rej => {
                console.warn('reject auth.service / getNicknameExist', rej);
                return Promise.reject(rej);
            });
    }

    public getByField (field : string, value : string) : Promise<any> {
        return this.apiService.get(`${this.getByUrl}/${field}/${value}`)
            .then(res => {
                console.warn('resolve auth.service / getByField', res);
                return Promise.resolve(res);
            }, rej => {
                console.warn('reject auth.service / getByField', rej);
                return Promise.reject(rej);
            });
    }

    public signup (email : string, password : string, name : string, surname : string, nickname : string, agree : boolean) : Promise<any> {
        return this.apiService
            .post(this.signupUrl, JSON.stringify(
                {
                    user: {
                        email,
                        password,
                        name,
                        surname,
                        nickname,
                        agree
                    }
                }
            ))
            .then(res => {
                return Promise.resolve(res);
            }, rej => {
                console.warn('reject auth.service / signup', rej);
                return Promise.reject(rej);
            });
    }

    public update (user: Object) {
        return this.apiService
            .patch(`${this.updateUrl}/${this.user.value.id}`, JSON.stringify({user}))
            .then(res => {
                return Promise.resolve(res);
            }, rej => {
                console.warn('reject auth.service / update', rej);
                return Promise.reject(rej);
            });
    }

    public login (email : string, password : string) : Promise<any> {

        return this.apiService
            .post(this.loginUrl, JSON.stringify(
                {
                    login: {
                        email,
                        password,
                        access_token_expire_at: 9999999999
                    }
                }
            ))
            .then(res => {
                this.authority.next(res.json().authority);
            }, rej => {
                console.warn('reject auth.service / login', rej);
                return Promise.reject(rej);
            });
    }

    public logout () : Promise<any> {

        return this.apiService
            .post(this.logoutUrl, JSON.stringify(
                {
                    logout: {
                        access_token: this.getAccessToken()
                    }
                }
            ))
            .then(res => {
                this.authority.next(null);
            }, rej => {
                console.warn('reject auth.service / logout', rej);
                return Promise.reject(rej);
            });
    }

    public resetpasswordrequest (email : string) : Promise<any> {

        return this.apiService
            .post(this.resetpasswordrequestUrl, JSON.stringify(
                {
                    resetpasswordrequest: {
                        email
                    }
                }
            ))
            .then(res => {
                return Promise.resolve(res);
            }, rej => {
                console.warn('reject auth.service / resetpasswordrequest', rej);
                return Promise.reject(rej);
            });
    }

    public resetpasswordverification (token : string, password : string) : Promise<any> {

        return this.apiService
            .post(this.resetpasswordverificationUrl, JSON.stringify(
                {
                    resetpasswordverification: {
                        token,
                        password
                    }
                }
            ))
            .then(res => {
                return Promise.resolve(res);
            }, rej => {
                console.warn('reject auth.service / resetpasswordverification', rej);
                return Promise.reject(rej);
            });
    }

    public activation (token : string) : Promise<any> {

        return this.apiService
            .post(this.activationUrl, JSON.stringify(
                {
                    activation: {
                        token
                    }
                }
            ))
            .then(res => {
                if (res.json().authority) {
                }
                return Promise.resolve(res);
            }, rej => {
                console.warn('reject auth.service / activation', rej);
                return Promise.reject(rej);
            });
    }
}