import {Component, Input} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {MatError, MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslatePipe} from "@ngx-translate/core";
import {MatOption, MatSelect} from '@angular/material/select';
import {FormRow, ServerErrors} from '../models';

@Component({
  selector: 'app-entity-form-rows',
  imports: [
    AsyncPipe,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatSlideToggle,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './entity-form-rows.html',
  styleUrl: './entity-form-rows.scss'
})
export class EntityFormRows {
  @Input() rows?: FormRow[]
  @Input() formControls?: { [key: string]: FormControl }
  @Input() serverErrors: ServerErrors = {}
  @Input() idPrefix?: string
}
