import {Injectable} from '@angular/core';

import 'rxjs/add/operator/toPromise';
import { BehaviorSubject } from 'rxjs/Rx';

import { ConfigService } from './config.service';
import { ApiService } from './api.service';
import {createUrlResolverWithoutPackagePrefix} from "@angular/compiler";

@Injectable()
export class UserService {


    public currentUser = new BehaviorSubject(null);
    private authorized = new BehaviorSubject(false);

    private authority = new BehaviorSubject(
        localStorage.getItem('authority')
            ? JSON.parse(localStorage.getItem('authority'))
            : null);

    public users = {};

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

    constructor(
        private configService: ConfigService,
        private apiService: ApiService
    ) { }

    public loadUser (id : string) : Promise<any> {
        if(!this.users.hasOwnProperty(id)) {
            this.users[id] = new BehaviorSubject(null);
        }
        return this.apiService
            .get(`${this.userUrl}/${id}`)
            .then(res => {
                this.users[res.json().user.id].next(res.json().user);
                this.currentUser.next(res.json().user);
            });
    }

    getAccessToken () : string {
        return this.authority.value ? this.authority.value.access_token : null;
    }

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
                    this.uninstallAuthority();
                });
            } else {
                this.uninstallAuthority();
            }
        });
    }

    getSmallAvatarUrl(user : {}) : string {

        if (user && user['avatar_cropped']) {
            return `${this.configService.g()['storageUrl']}${user['avatar_cropped'].url}`;
        }
        if (user && user['avatar']) {
            return `${this.configService.g()['storageUrl']}${user['avatar'].url}`;
        }
        return 'assets/images/defaultAvatar.png';
    }

    getAvatarUrl(user : {}) : string {
        if (user && user['avatar']) {
            return `${this.configService.g()['storageUrl']}${user['avatar'].url}`;
        }
        return 'assets/images/defaultAvatar.png';
    }

    public uninstallAuthority() {
        this.setAuthorizedNext(false);
        localStorage.removeItem('authority');
        this.apiService.setAccessToken(null);
        this.currentUser.next(null);
        this.users = {};
    }

    public getEmailExist (value : string) : Promise<any> {
        return this.apiService.get(`${this.getEmailExistUrl}/${value}`)
            .then(res => {
                return Promise.resolve(res);
            }, rej => {
                return Promise.reject(rej);
            });
    }

    public getNicknameExist (value : string) : Promise<any> {
        return this.apiService.get(`${this.getNicknameExistUrl}/${value}`)
            .then(res => {
                return Promise.resolve(res);
            }, rej => {
                return Promise.reject(rej);
            });
    }

    public getByField (field : string, value : string) : Promise<any> {
        return this.apiService.get(`${this.getByUrl}/${field}/${value}`)
            .then(res => {
                return Promise.resolve(res);
            }, rej => {
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
                return Promise.reject(rej);
            });
    }

    public update (user: Object) {
        return this.apiService
            .patch(`${this.updateUrl}/${this.currentUser.value.id}`, JSON.stringify({user}))
            .then(res => {
                return Promise.resolve(res);
            }, rej => {
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
                return Promise.reject(rej);
            });
    }
}