import {Injectable} from '@angular/core';

import 'rxjs/add/operator/toPromise';
import { BehaviorSubject } from 'rxjs/Rx';

import { ConfigService } from './config.service';
import { ApiService } from './api.service';

@Injectable()
export class ProjectService {

    public getByUserAndTitleUrl = '/project/by/user_id/{user_id}/and/title/{title}';
    public projectUrl = '/project';
    public projectUpdateUrl = '/project';

    constructor(
        private configService: ConfigService,
        private apiService: ApiService
    ) { }

    public getProjectByUserIdAndTitle (user_id : string, title : string) : Promise<any> {
        return this.apiService
            .get(this.getByUserAndTitleUrl.split('{user_id}').join(user_id).split('{title}').join(title));
    }

    getLogoUrl(project : {}) : string {
        if (project && project['logo']) {
            return `${this.configService.g()['storageUrl']}${project['logo'].url}`;
        }
        return 'assets/images/defaultLogo.png';
    }

    public get (id : String) {
        return this.apiService
            .get(this.projectUrl + '/' + id)
            .then(res => {
                return Promise.resolve(res);
            }, rej => {
                return Promise.reject(rej);
            });
    }

    public create (user_id : String, title : String, description : String) {
        return this.apiService
            .post(this.projectUrl, JSON.stringify(
                {
                    project: {
                        user_id,
                        title,
                        description
                    }
                }
            ))
            .then(res => {
                return Promise.resolve(res);
            }, rej => {
                return Promise.reject(rej);
            });
    }

    public update (project: Object) {
        return this.apiService
            .patch(`${this.projectUpdateUrl}/${project['id']}`, JSON.stringify({project}))
            .then(res => {
                return Promise.resolve(res);
            }, rej => {
                return Promise.reject(rej);
            });
    }

    public list (user_id : string, page : string = '1') {
        return this.apiService
            .get(`/project/list?page=${page}&limit=5&order_by=-created_at,name&filter[user_id]=${user_id}`)
            .then(res => {
                return Promise.resolve(res);
            }, rej => {
                return Promise.reject(rej);
            });
    }
}