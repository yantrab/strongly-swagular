import { Directive, ElementRef, EventEmitter, Inject, Output } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[appFileUpload]'
})
export class FileUploadDirective {
  @Output() fileContent: EventEmitter<ArrayBuffer | string> = new EventEmitter();

  constructor(private elementRef: ElementRef, @Inject(DOCUMENT) private document: Document) {
    this.elementRef.nativeElement.addEventListener('click', () => {
      const input = this.document.createElement('input');
      input.type = 'file';
      input.onchange = ev => {
        const file = (ev.target as HTMLInputElement).files?.item(0);
        const reader = new FileReader();
        reader.onload = e => {
          this.fileContent.next(reader.result!);
          input.value = '';
        };
        switch (file?.type) {
          case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            reader.readAsArrayBuffer(file!);
            break;
          default:
            reader.readAsText(file!);
        }
      };
      input.click();
      input.remove();
    });
  }
}
