import {Component} from '@angular/core';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatDialogContent} from '@angular/material/dialog';

@Component({
  selector: 'app-loading-dialog',
  imports: [
    MatProgressSpinner,
    MatDialogContent
  ],
  templateUrl: './loading-dialog.html',
  styleUrl: './loading-dialog.scss'
})
export class LoadingDialog {

}
