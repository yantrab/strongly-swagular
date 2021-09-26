import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SwagularComponentModule } from 'swagular/components';
import { ProgressComponent } from './progress/progress.component';

@NgModule({
  declarations: [ProgressComponent],
  imports: [CommonModule, ReactiveFormsModule, SwagularComponentModule],
  exports: [CommonModule, SwagularComponentModule, ProgressComponent],
  providers: []
})
export class ComponentModule {}
const a = [
  'access_data',
  'create_table_calculations',
  'download_without_limit',
  'explore',
  'manage_spaces',
  'save_content',
  'schedule_look_emails',
  'see_drill_overlay',
  'see_lookml',
  'see_lookml_dashboards',
  'see_looks',
  'see_sql',
  'see_user_dashboards',
  'use_sql_runner'
];
