import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SwagularComponentModule } from 'swagular/components';
import { ProgressComponent } from './progress/progress.component';
import { FileUploadDirective } from '../directives/file-upload.directive';

@NgModule({
  declarations: [ProgressComponent, FileUploadDirective],
  imports: [CommonModule, ReactiveFormsModule, SwagularComponentModule],
  exports: [CommonModule, SwagularComponentModule, ProgressComponent, FileUploadDirective],
  providers: []
})
export class ComponentModule {}
