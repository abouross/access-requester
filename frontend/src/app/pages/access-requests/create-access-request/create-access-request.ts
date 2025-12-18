import {Component} from '@angular/core';
import {EntityForm} from '../../../components/entity-form/entity-form';
import {TranslatePipe} from '@ngx-translate/core';
import {FormConfig} from '../../../components/entity-form/models';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-create-access-request',
  imports: [
    EntityForm,
    TranslatePipe
  ],
  templateUrl: './create-access-request.html',
  styleUrl: './create-access-request.scss'
})
export class CreateAccessRequest {
  protected formConfig: FormConfig = {
    rows: [

    ],
    formType: 'CREATE',
    backendUrl: environment.apiBaseUrl + '/access-requests',
    idPrefix: 'access_request_',
  };

}
