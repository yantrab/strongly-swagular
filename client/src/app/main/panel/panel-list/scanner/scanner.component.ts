import { Component } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-scanner',
  template: `
    <zxing-scanner (scanSuccess)="scanCompleteHandler($event)"></zxing-scanner>
    <button (click)="cancel()" mat-button>המשך ללא סריקת בר קוד</button>
  `
})
export class ScannerComponent {
  constructor(public dialogRef: MatDialogRef<ScannerComponent>) {}
  scanCompleteHandler(event: any) {
    console.log(event);
    this.dialogRef.close(event);
  }

  cancel() {
    this.dialogRef.close();
  }
}
