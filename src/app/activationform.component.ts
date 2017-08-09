import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { UserService } from './user.service';
import { ValidatorsService } from './validators.service';

import 'rxjs/add/operator/switchMap';

@Component({
    selector: 'my-activationform',
    templateUrl: './activationform.component.html'
})
export class ActivationformComponent implements OnInit {

    constructor(
        private userService : UserService,
        private activatedRoute : ActivatedRoute
    ) {}

    public form: FormGroup;
    public control_token: FormControl;
    public validator;
    public requestInProgress : boolean = false;
    @Output() onSubmitEmitter = new EventEmitter<any>();

    ngOnInit() {
        this.control_token = new FormControl('', [Validators.required]);
        this.form = new FormGroup({
            token: this.control_token,
        });
        this.validator = () => {
            return {
                valid: this.form.valid,

                token_has_error: this.control_token.invalid && this.control_token.dirty,
                token_has_success: this.control_token.valid && this.control_token.dirty,
                token_error_required: this.control_token.dirty && this.control_token.errors && this.control_token.errors['required'],
                token_show_remove: this.control_token.invalid && this.control_token.dirty,
                token_show_ok: this.control_token.valid && this.control_token.dirty
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

        window['$']('#activation_component_activationButton').button('loading');

        this.requestInProgress = true;

        this.userService.activation(this.form.value.token).then(res => {
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
        }).then(() => { window['$']('#activation_component_activationButton').button('reset'); this.requestInProgress = false; this.form.reset(); });


    }

}