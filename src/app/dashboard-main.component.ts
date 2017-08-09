import {Component, OnInit, AfterViewChecked} from '@angular/core';

import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { ValidatorsService } from './validators.service';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import {BehaviorSubject} from "rxjs";

declare var jquery:any;
declare var $ :any;

@Component({
    selector: 'my-dashboard-main',
    templateUrl: './dashboard-main.component.html'
})
export class DashboardmainComponent implements OnInit, AfterViewChecked {

    constructor(
        private authService : AuthService,
        private apiService : ApiService,
        private validatorsService : ValidatorsService
    ) {}

    public user : any = null;
    public error_message : string = null;

    public countries : BehaviorSubject<any> = new BehaviorSubject([]);
    public cities : BehaviorSubject<any> = new BehaviorSubject([]);
    public eyes : BehaviorSubject<any> = new BehaviorSubject([]);
    public vocal : BehaviorSubject<any> = new BehaviorSubject([]);
    public dance : BehaviorSubject<any> = new BehaviorSubject([]);
    public positions : BehaviorSubject<any> = new BehaviorSubject([]);

    public form: FormGroup;
    public control_name: FormControl;
    public control_surname: FormControl;
    public control_sex: FormControl;
    public control_birthday: FormControl;
    public control_cellphone: FormControl;
    public control_country: FormControl;
    public control_city: FormControl;
    public control_company: FormControl;
    public control_about: FormControl;
    public control_awards: FormControl;
    public control_portfolio: FormControl;
    public control_hasForeignPassport: FormControl;
    public control_weight: FormControl;
    public control_growth: FormControl;
    public control_eyes: FormControl;
    public control_vocal: FormControl;
    public control_dance: FormControl;
    public control_positions: FormControl;
    public validator;

    public birthday_visible : string;

    ngOnInit() {
        this.control_name = new FormControl('', [Validators.required]);
        this.control_surname = new FormControl('', [Validators.required]);
        this.control_sex = new FormControl('', [this.validatorsService.sex]);
        this.control_birthday = new FormControl('', []);
        this.control_cellphone = new FormControl('', [this.validatorsService.cellphone]);
        this.control_country = new FormControl('');
        this.control_city = new FormControl('');
        this.control_company = new FormControl('');
        this.control_about = new FormControl('');
        this.control_awards = new FormControl('');
        this.control_portfolio = new FormControl('');
        this.control_hasForeignPassport = new FormControl(false);
        this.control_weight = new FormControl('');
        this.control_growth = new FormControl('');
        this.control_eyes = new FormControl('');
        this.control_vocal = new FormControl(['']);
        this.control_dance = new FormControl(['']);
        this.control_positions = new FormControl(['']);
        this.form = new FormGroup({
            name: this.control_name,
            surname: this.control_surname,
            sex: this.control_sex,
            birthday: this.control_birthday,
            cellphone: this.control_cellphone,
            country: this.control_country,
            city: this.control_city,
            company: this.control_company,
            about: this.control_about,
            awards: this.control_awards,
            portfolio: this.control_portfolio,
            hasForeignPassport: this.control_hasForeignPassport,
            weight: this.control_weight,
            growth: this.control_growth,
            eyes: this.control_eyes,
            vocal: this.control_vocal,
            dance: this.control_dance,
            positions: this.control_positions,
        });
        this.validator = () => {
            return {
                valid: this.form.valid,

                name_has_error: this.control_name.invalid && this.control_name.dirty,
                name_has_success: this.control_name.valid && this.control_name.dirty,
                name_error_required: this.control_name.dirty && this.control_name.errors && this.control_name.errors['required'],
                name_show_remove: this.control_name.invalid && this.control_name.dirty,
                name_show_ok: this.control_name.valid && this.control_name.dirty,

                surname_has_error: this.control_surname.invalid && this.control_surname.dirty,
                surname_has_success: this.control_surname.valid && this.control_surname.dirty,
                surname_error_required: this.control_surname.dirty && this.control_surname.errors && this.control_surname.errors['required'],
                surname_show_remove: this.control_surname.invalid && this.control_surname.dirty,
                surname_show_ok: this.control_surname.valid && this.control_surname.dirty,

                cellphone_has_error: this.control_cellphone.invalid && this.control_cellphone.dirty,
                cellphone_has_success: this.control_cellphone.valid && this.control_cellphone.dirty,
                cellphone_error_cellphone: this.control_cellphone.dirty && this.control_cellphone.errors && this.control_cellphone.errors['cellphone'],
                cellphone_show_remove: this.control_cellphone.invalid && this.control_cellphone.dirty,
                cellphone_show_ok: this.control_cellphone.valid && this.control_cellphone.dirty,
            }
        };

        this.user = this.authService.user;
        this.authService.user.subscribe(user => {
            this.user = user;
            if (user) {
                this.control_name.setValue(user.name);
                this.control_surname.setValue(user.surname);
                this.control_sex.setValue(user.sex ? user.sex : 'null_value');
                this.control_birthday.setValue(user.birthday);
                /**
                 * because Sword Lily. 'valueChanges' not fires after switching to this view from another
                 */
                this.birthdayDatepicker(user.birthday);
                this.control_cellphone.setValue(user.cellphone);
                this.control_company.setValue(user.company);
                this.control_about.setValue(user.about);
                this.control_awards.setValue(user.awards);
                this.control_portfolio.setValue(user.portfolio);
                this.control_hasForeignPassport.setValue(user.hasForeignPassport);
                this.control_weight.setValue(user.weight);
                this.control_growth.setValue(user.growth);

                this.apiService.fetchVariable('countries,eyes,vocal,dance,positions').then(res => {
                    this.countries.next(res.json().variables.countries.value);
                    this.control_country.valueChanges.subscribe(v => {
                        this.cities.next(v === 'null_value' ? [] : this.countries.value['filter'](c => c.code === v)[0].cities);
                        this.control_city.setValue('null_value');
                    });
                    this.control_country.setValue(user.country ? user.country : 'null_value');
                    this.control_city.setValue(user.city ? user.city : 'null_value');

                    this.eyes.next(res.json().variables.eyes.value);
                    this.control_eyes.setValue(user.eyes ? user.eyes : 'null_value');

                    this.vocal.next(res.json().variables.vocal.value);
                    this.control_vocal.setValue(user.vocal);

                    this.dance.next(res.json().variables.dance.value);
                    this.control_dance.setValue(user.dance);
                    this.control_dance.valueChanges.subscribe(v => {

                    });

                    this.positions.next(res.json().variables.positions.value);
                    this.control_positions.setValue(user.positions);
                });

                this.control_birthday.valueChanges.subscribe(v => {
                    this.birthdayDatepicker(v);
                });
            }
        });


    }

    ngAfterViewChecked () {
        $("[formControlName='hasForeignPassport']").bootstrapSwitch({
            onColor: 'warning',
            onText: 'Да',
            offText: 'Нет',
            onSwitchChange: (event, state) => {
                this.control_hasForeignPassport.setValue(state);
                this.control_hasForeignPassport.markAsDirty();
            }
        });
        $("[name='birthday_visible']:not(.datepickered)").addClass('datepickered').datepicker({
            zIndexOffset: 100,
            format: 'yyyy-mm-dd',
            autoclose: true,
            language: 'ru',
            weekStart: 1
        }).on('changeDate', (e) => {
            this.control_birthday.setValue(new Date(e['date']).getTime() / 1000);
            this.control_birthday.markAsDirty();
        });
    }

    public birthdayDatepicker(v) {
        var date = new Date(v * 1000);
        var month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
        var day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
        this.birthday_visible = `${date.getFullYear()}-${month}-${day}`;
        if($("[name='birthday_visible'].datepickered").length) {
            if($("[name='birthday_visible'].datepickered").datepicker('getDate').getTime() !== date.getTime()) {
                $("[name='birthday_visible'].datepickered").datepicker('setDate', date);
            }
        }
    }

    public onSubmit() {
        this.authService.update({
            name: this.form.value.name,
            surname: this.form.value.surname,
            sex: this.form.value.sex === 'null_value' ? null : this.form.value.sex,
            birthday: this.form.value.birthday,
            cellphone: this.form.value.cellphone,
            country: this.form.value.country === 'null_value' ? null : this.form.value.country,
            city: this.form.value.city === 'null_value' ? null : this.form.value.city,
            company: this.form.value.company,
            about: this.form.value.about,
            awards: this.form.value.awards,
            portfolio: this.form.value.portfolio,
            hasForeignPassport: this.form.value.hasForeignPassport,
            weight: this.form.value.weight,
            growth: this.form.value.growth,
            eyes: this.form.value.eyes === 'null_value' ? null : this.form.value.eyes,
            vocal: this.form.value.vocal,
            dance: this.form.value.dance,
            positions: this.form.value.positions,
        }).then(res => {
            this.authService.loadUser(this.user.id)
                .then(res => {
                    this.onReset();
                });
        })
    }

    public onReset() {
        this.form.reset({
            name: this.user.name,
            surname: this.user.surname,
            sex: this.user.sex ? this.user.sex : 'null_value' ,
            birthday: this.user.birthday,
            cellphone: this.user.cellphone,
            country: this.user.country ? this.user.country : 'null_value' ,
            city: this.user.city ? this.user.city : 'null_value' ,
            company: this.user.company,
            about: this.user.about,
            awards: this.user.awards,
            portfolio: this.user.portfolio,
            hasForeignPassport: this.user.hasForeignPassport,
            weight: this.user.weight,
            growth: this.user.growth,
            eyes: this.user.eyes ? this.user.eyes : 'null_value',
            vocal: this.user.vocal,
            dance: this.user.dance,
            positions: this.user.positions,
        });
        $("[formControlName='hasForeignPassport']").bootstrapSwitch('state', this.user.hasForeignPassport, true);
    }

    public fillBirthday (birthday) {
        var date = new Date(birthday * 1000);
        var month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
        var day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
        this.birthday_visible = `${date.getFullYear()}-${month}-${day}`;
    }
}