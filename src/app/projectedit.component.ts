import {
    Component, OnInit, EventEmitter, Input, Output, AfterViewChecked, AfterViewInit,
    ViewChild
} from '@angular/core';
import {FormGroup, FormControl, Validators, ValidationErrors, AbstractControl} from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from './user.service';
import { ApiService } from './api.service';
import { ProjectService } from './project.service';
import { ValidatorsService } from './validators.service';

import 'rxjs/add/operator/switchMap';
import {BehaviorSubject} from "rxjs";
import {ProjectlogoComponent} from "./projectlogo.component";

declare var jquery:any;
declare var $ :any;

@Component({
    selector: 'my-projectedit',
    templateUrl: './projectedit.component.html'
})
export class ProjecteditComponent implements OnInit, AfterViewInit, AfterViewChecked {

    @Input() projectId = null;
    @Output() onSubmitEmitter = new EventEmitter<any>();


    @ViewChild(ProjectlogoComponent)
    private projectlogoComponent: ProjectlogoComponent;

    public error_message : string = null;

    public project = new BehaviorSubject(null);

    public type : BehaviorSubject<any> = new BehaviorSubject([]);
    public genres : BehaviorSubject<any> = new BehaviorSubject([]);
    public duration_units : BehaviorSubject<any> = new BehaviorSubject([]);
    public countries : BehaviorSubject<any> = new BehaviorSubject([]);
    public cities : BehaviorSubject<any> = new BehaviorSubject([]);

    public form: FormGroup;
    public control_title: FormControl;
    public title_loading: boolean = false;
    public control_description: FormControl;
    public control_type: FormControl;
    public control_genres: FormControl;
    public control_genres_custom: FormControl;
    public control_start_date: FormControl;
    public control_deadline_date: FormControl;
    public control_duration: FormControl;
    public control_duration_units: FormControl;
    public control_country: FormControl;
    public control_city: FormControl;
    public control_place: FormControl;
    public control_status: FormControl;

    public start_date_visible : string;
    public deadline_date_visible : string;

    public validator;
    public requestInProgress : boolean = false;

    constructor(
        private router : Router,
        private userService : UserService,
        private apiService : ApiService,
        private projectService : ProjectService,
        private validatorsService : ValidatorsService
    ) {}

    ngOnInit() {

        this.control_title = new FormControl('', [Validators.required]);
        this.control_description = new FormControl('', [Validators.required]);
        this.control_type = new FormControl('', [this.validatorsService.required_if_not_on_hold]);
        this.control_genres = new FormControl(['']);
        this.control_genres_custom = new FormControl('');
        this.control_start_date = new FormControl('', [this.validatorsService.required_if_not_on_hold]);
        this.control_deadline_date = new FormControl('');
        this.control_duration = new FormControl('', [this.validatorsService.required_if_not_on_hold]);
        this.control_duration.valueChanges.subscribe((v) => {
            if (Math.abs(this.control_duration.value) == this.control_duration.value) {
                return;
            }
            this.control_duration.setValue(Math.abs(this.control_duration.value));
        });
        this.control_duration_units = new FormControl('');
        this.control_country = new FormControl('');
        this.control_city = new FormControl('', [this.validatorsService.required_if_not_on_hold]);
        this.control_place = new FormControl('', [this.validatorsService.required_if_not_on_hold]);
        this.control_status = new FormControl('');
        this.control_status.valueChanges.subscribe(() => {
            this.control_type.markAsDirty();
            this.control_type.updateValueAndValidity();
            this.control_start_date.markAsDirty();
            this.control_start_date.updateValueAndValidity();
            this.control_duration.markAsDirty();
            this.control_duration.updateValueAndValidity();
            this.control_city.markAsDirty();
            this.control_city.updateValueAndValidity();
            this.control_place.markAsDirty();
            this.control_place.updateValueAndValidity();
        })

        this.form = new FormGroup({
            title: this.control_title,
            description: this.control_description,
            type: this.control_type,
            genres: this.control_genres,
            genres_custom: this.control_genres_custom,
            start_date: this.control_start_date,
            deadline_date: this.control_deadline_date,
            duration: this.control_duration,
            duration_units: this.control_duration_units,
            country: this.control_country,
            city: this.control_city,
            place: this.control_place,
            status: this.control_status,
        }, () => {return null;});

        /**
         * Async validators
         */
        this.control_title.valueChanges.debounceTime(300).subscribe((changes) => {
            this.title_loading = true;
            this.validatorsService.uniqueProjectTitle(this.control_title, changes, this.projectId).then(res => {
                this.title_loading = false;
            }, rej => { this.title_loading = false; });
        });

        this.validator = () => {
            return {
                loading: this.title_loading,
                valid: this.form.valid,

                title_loading: this.title_loading,

                title_has_error: this.control_title.invalid && this.control_title.dirty,
                title_has_success: this.control_title.valid && this.control_title.dirty,
                title_error_required: this.control_title.dirty && this.control_title.errors && this.control_title.errors['required'],
                title_error_uniqueProjectTitle: this.control_title.dirty && this.control_title.errors && this.control_title.errors['uniqueProjectTitle'],
                title_show_remove: this.control_title.invalid && this.control_title.dirty && !this.title_loading,
                title_show_ok: this.control_title.valid && this.control_title.dirty && !this.title_loading,
                title_show_loading: this.control_title.dirty && this.title_loading,

                description_has_error: this.control_description.invalid && this.control_description.dirty,
                description_has_success: this.control_description.valid && this.control_description.dirty,
                description_error_required: this.control_description.dirty && this.control_description.errors && this.control_description.errors['required'],
                description_show_remove: this.control_description.invalid && this.control_description.dirty,
                description_show_ok: this.control_description.valid && this.control_description.dirty,

                type_has_error: this.control_type.invalid && this.control_type.dirty,
                type_has_success: this.control_type.valid && this.control_type.dirty,
                type_error_required_if_not_on_hold: this.control_type.dirty && this.control_type.errors && this.control_type.errors['required_if_not_on_hold'],
                type_show_remove: this.control_type.invalid && this.control_type.dirty,
                type_show_ok: this.control_type.valid && this.control_type.dirty,

                start_date_has_error: this.control_start_date.invalid && this.control_start_date.dirty,
                start_date_has_success: this.control_start_date.valid && this.control_start_date.dirty,
                start_date_error_required_if_not_on_hold: this.control_start_date.dirty && this.control_start_date.errors && this.control_start_date.errors['required_if_not_on_hold'],
                start_date_show_remove: this.control_start_date.invalid && this.control_start_date.dirty,
                start_date_show_ok: this.control_start_date.valid && this.control_start_date.dirty,

                duration_has_error: this.control_duration.invalid && this.control_duration.dirty,
                duration_has_success: this.control_duration.valid && this.control_duration.dirty,
                duration_error_required_if_not_on_hold: this.control_duration.dirty && this.control_duration.errors && this.control_duration.errors['required_if_not_on_hold'],
                duration_show_remove: this.control_duration.invalid && this.control_duration.dirty,
                duration_show_ok: this.control_duration.valid && this.control_duration.dirty,

                city_has_error: this.control_city.invalid && this.control_city.dirty,
                city_has_success: this.control_city.valid && this.control_city.dirty,
                city_error_required_if_not_on_hold: this.control_city.dirty && this.control_city.errors && this.control_city.errors['required_if_not_on_hold'],
                city_show_remove: this.control_city.invalid && this.control_city.dirty,
                city_show_ok: this.control_city.valid && this.control_city.dirty,

                place_has_error: this.control_place.invalid && this.control_place.dirty,
                place_has_success: this.control_place.valid && this.control_place.dirty,
                place_error_required_if_not_on_hold: this.control_place.dirty && this.control_place.errors && this.control_place.errors['required_if_not_on_hold'],
                place_show_remove: this.control_place.invalid && this.control_place.dirty,
                place_show_ok: this.control_place.valid && this.control_place.dirty,

            }
        };

        this.project.subscribe(project => {
            if (project) {
                this.form.reset({
                    title: project.title,
                    description: project.description,
                    type: project.type ? project.type : 'null_value',
                    genres: project.genres,
                    genres_custom: project.genres_custom,
                    start_date: project.start_date,
                    deadline_date: project.deadline_date,
                    duration: project.duration,
                    duration_units: project.duration_units,
                    country: project.country ? project.country : 'null_value',
                    city: project.city ? project.city : 'null_value',
                    place: project.place,
                    status: project.status,
                });
                this.startDateDatepicker(project.start_date);
                this.control_start_date.valueChanges.subscribe(v => {
                    this.startDateDatepicker(v);
                });
                this.deadlineDateDatepicker(project.deadline_date);
                this.control_deadline_date.valueChanges.subscribe(v => {
                    this.deadlineDateDatepicker(v);
                });
                this.apiService.fetchVariable('project_types,project_genres,duration_units,countries').then(res => {
                    this.type.next(res.json().variables.project_types.value);
                    this.control_type.setValue(project.type ? project.type : 'null_value');
                    this.genres.next(res.json().variables.project_genres.value);
                    this.control_genres.setValue(project.genres);
                    this.duration_units.next(res.json().variables.duration_units.value);
                    this.control_duration_units.setValue(project.duration_units ? project.duration_units : 'day');
                    this.countries.next(res.json().variables.countries.value);
                    this.control_country.valueChanges.subscribe(v => {
                        this.cities.next(v === 'null_value' ? [] : this.countries.value['filter'](c => c.code === v)[0].cities);
                        this.control_city.setValue('null_value');
                    });
                    this.control_country.setValue(project.country ? project.country : 'null_value');
                    this.control_city.setValue(project.city ? project.city : 'null_value');
                });
            }
        });

        this.projectService.get(this.projectId)
            .then(res => {
                this.project.next(res.json().project);
            });

    }

    ngAfterViewInit () {
        this.project.subscribe(project => {
            if (project) {
                setTimeout(() => {
                    this.projectlogoComponent.onSubmitEmitter.subscribe((message) => {
                        if (message.action == 'uploaded') {
                            this.onSubmitEmitter.emit({status:200});
                        }
                    });
                }, 0);
            }
        });
    }

    ngAfterViewChecked() {
        $("[name='start_date_visible_"+this.projectId+"']:not(.datepickered)").addClass('datepickered').datepicker({
            zIndexOffset: 100,
            format: 'yyyy-mm-dd',
            autoclose: true,
            language: 'ru',
            weekStart: 1
        }).on('changeDate', (e) => {
            this.control_start_date.setValue(new Date(e['date']).getTime() / 1000);
            this.control_start_date.markAsDirty();
        });

        $("[name='deadline_date_visible_"+this.projectId+"']:not(.datepickered)").addClass('datepickered').datepicker({
            zIndexOffset: 100,
            format: 'yyyy-mm-dd',
            autoclose: true,
            language: 'ru',
            weekStart: 1
        }).on('changeDate', (e) => {
            this.control_deadline_date.setValue(new Date(e['date']).getTime() / 1000);
            this.control_deadline_date.markAsDirty();
        });
    }

    public startDateDatepicker(v) {
        var date = new Date(v * 1000);
        var month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
        var day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
        this.start_date_visible = `${date.getFullYear()}-${month}-${day}`;
        if($("[name='start_date_visible_"+this.projectId+"'].datepickered").length) {
            if(null === $("[name='start_date_visible_"+this.projectId+"'].datepickered").datepicker('getDate') || $("[name='start_date_visible_"+this.projectId+"'].datepickered").datepicker('getDate').getTime() !== date.getTime()) {
                $("[name='start_date_visible_"+this.projectId+"'].datepickered").datepicker('setDate', date);
            }
        }
    }

    public deadlineDateDatepicker(v) {
        var date = new Date(v * 1000);
        var month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
        var day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
        this.deadline_date_visible = `${date.getFullYear()}-${month}-${day}`;
        if($("[name='deadline_date_visible_"+this.projectId+"'].datepickered").length) {
            if(null === $("[name='deadline_date_visible_"+this.projectId+"'].datepickered").datepicker('getDate') || $("[name='deadline_date_visible_"+this.projectId+"'].datepickered").datepicker('getDate').getTime() !== date.getTime()) {
                $("[name='deadline_date_visible_"+this.projectId+"'].datepickered").datepicker('setDate', date);
            }
        }
    }

    onSubmit() {

        this.error_message = null;

        if (!this.validator().valid) {
            return;
        }

        this.error_message = null;

        window['$']('#projectedit_'+this.projectId+'_submitButton').button('loading');

        this.requestInProgress = true;

        this.projectService.update({
            id: this.projectId,
            title: this.form.value.title,
            description: this.form.value.description,
            type: this.form.value.type === 'null_value' ? null : this.form.value.type,
            genres: this.form.value.genres,
            genres_custom: this.form.value.genres_custom,
            start_date: this.form.value.start_date,
            deadline_date: this.form.value.deadline_date,
            duration: this.form.value.duration,
            duration_units: this.form.value.duration_units,
            country: this.form.value.country === 'null_value' ? null : this.form.value.country,
            city: this.form.value.city === 'null_value' ? null : this.form.value.city,
            place: this.form.value.place,
            status: this.form.value.status,
        }).then((res) => {
            console.log(`${res.json().project.id} updated`);
            this.onSubmitEmitter.emit({status:200,project:res.json().project});
            this.form.reset({
                title: res.json().project.title,
                description: res.json().project.description,
                type: res.json().project.type ? res.json().project.type : 'null_value',
                genres: res.json().project.genres,
                genres_custom: res.json().project.genres_custom,
                start_date: res.json().project.start_date,
                deadline_date: res.json().project.deadline_date,
                duration: res.json().project.duration,
                duration_units: res.json().project.duration_units,
                country: res.json().project.country ? res.json().project.country : 'null_value',
                city: res.json().project.city ? res.json().project.city : 'null_value',
                place: res.json().project.place,
                status: res.json().project.status,
            });
            this.startDateDatepicker(res.json().project.start_date);
            /*
            this.control_start_date.valueChanges.subscribe(v => {
                this.startDateDatepicker(v);
            });
            */
            this.deadlineDateDatepicker(res.json().project.deadline_date);
            /*
            this.control_deadline_date.valueChanges.subscribe(v => {
                this.deadlineDateDatepicker(v);
            });
            */
        }, rej => {
            switch (rej.status) {
                case 0:
                    this.error_message = "Связь с сервером отсутствует. Пожалуйста, перезагрузите страницу и попробуйте позже.";
                    break;
                case 400:
                    this.onSubmitEmitter.emit({status:400,custom_error_message:"Неправильные данные."});
                    break;
                case 403:
                    this.error_message = "Логин или пароль указаны неверно";
                    //this.error_message = "Пользователь с таким email не найден.";
                    break;
                case 409:
                    this.error_message = "Такой title уже существует.";
                    break;
                case 500:
                    this.error_message = "На сервере произошла ошибка. Пожалуйста, перезагрузите страницу и попробуйте позже.";
                    break;
                default:
                    this.error_message = "Неизвестная ошибка. Пожалуйста, перезагрузите страницу и попробуйте позже.";
                    break;
            }
        }).then(() => {
            window['$']('#projectedit_'+this.projectId+'_submitButton').button('reset');
            setTimeout(() => {
                window['$']('#projectedit_'+this.projectId+'_submitButton').prop('disabled', true);
            }, 0);
            this.requestInProgress = false;
        });

    }

}