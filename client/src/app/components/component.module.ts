import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SwagularComponentModule } from 'swagular/components';

@NgModule({
  declarations: [],
  imports: [CommonModule, ReactiveFormsModule, SwagularComponentModule],
  exports: [CommonModule, SwagularComponentModule],
  providers: []
})
export class ComponentModule {}
