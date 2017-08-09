import {Injectable} from '@angular/core';

import { Headers, Http, RequestOptionsArgs, Response } from "@angular/http";

import { ConfigService } from './config.service';
import { ErrorService } from './error.service';

import 'rxjs/add/operator/toPromise';
import {variable} from "@angular/compiler/src/output/output_ast";

@Injectable()
export class ApiService {

    private apiUrl = this.configService.g()['apiUrl'];
    private token : string|null = null;

    constructor (
        private http : Http,
        private configService : ConfigService,
        private errorService : ErrorService
    ) {}

    setAccessToken (token: string) : void {
        this.token = token;
    }

    private attachServiceHeaders(options : RequestOptionsArgs) : RequestOptionsArgs {
        options = typeof options != 'undefined' ? options : {};
        options.headers = options.hasOwnProperty('headers') ? options.headers : new Headers();
        options.headers.set('Content-Type', 'application/json');
        if (this.token) {
            options.headers.set('X-Auth', this.token);
        }
        return options;
    }

    get(url: string, options?: RequestOptionsArgs): Promise<Response> {
        return this.http.get(this.apiUrl + url, this.attachServiceHeaders(options))
            .toPromise()
            .catch(this.handleError.bind(this));
    }

    post(url: string, body: any, options?: RequestOptionsArgs): Promise<Response> {
        return this.http.post(this.apiUrl + url, body, this.attachServiceHeaders(options))
            .toPromise()
            .catch(this.handleError.bind(this));
    }

    patch(url: string, body: any, options?: RequestOptionsArgs): Promise<Response> {
        return this.http.patch(this.apiUrl + url, body, this.attachServiceHeaders(options))
            .toPromise()
            .catch(this.handleError.bind(this));
    }

    delete(url: string, options?: RequestOptionsArgs): Promise<Response> {
        return this.http.delete(this.apiUrl + url, this.attachServiceHeaders(options))
            .toPromise()
            .catch(this.handleError.bind(this));
    }

    fetchVariable(variable : string, $user_id : string = null) {
        return this.get(`/variable/${variable}`);
    }
    /**
     * Performs a request with `put` http method.
     */
    //put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response>;

    private handleError(error: any): Promise<any> {
        if (!error.hasOwnProperty('status') || error.status === 0) {
            this.errorService.handleError(error.message, error);
        }
        return Promise.reject(error.message || error);
    }
}