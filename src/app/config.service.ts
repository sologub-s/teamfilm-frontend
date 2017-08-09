import {Injectable} from '@angular/core';

import 'rxjs/add/operator/toPromise';
import { BehaviorSubject } from 'rxjs/Rx';

import {MyConfig} from "../../config/config";

@Injectable()
export class ConfigService {

    private config : Object;

    public constructor() {
        this.config = MyConfig;
    }

    getConfig() : Object {
        return this.config;
    }

    /**
     * Shortcut for getConfig
     * @returns {Object}
     */
    g() : Object {
        return this.getConfig();
    }
}