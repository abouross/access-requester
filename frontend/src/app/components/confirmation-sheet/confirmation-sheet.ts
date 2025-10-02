import {Component, inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-confirmation-sheet',
  imports: [MatButton],
  templateUrl: './confirmation-sheet.html',
  styleUrl: './confirmation-sheet.scss'
})
export class ConfirmationSheet {
  data: { title: string } = inject(MAT_BOTTOM_SHEET_DATA)
  protected _bottomSheetRef = inject<MatBottomSheetRef<ConfirmationSheet>>(MatBottomSheetRef);
}
