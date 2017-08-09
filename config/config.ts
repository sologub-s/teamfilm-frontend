//export const zxc = '123';
//export const qwerty = '777';

switch (process.env.NODE_ENV) {
    case 'prod':
    case 'production':
        var _conf = require('./../config/config.prod');
        break;
    case 'test':
    case 'testing':
        var _conf = require('./../config/config.test');
        break;
    case 'dev':
    case 'development':
    default:
        var _conf = require('./../config/config.dev');
}

const _commonConf = require('./../config/config.common');

export const MyConfig = Object.assign({}, _commonConf, _conf)