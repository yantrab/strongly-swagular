import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PanelService as API } from '../../../api/services/panel.service';
import { SwagularService } from 'swagular';
import { PanelService } from '../panel.service';
import { ActivatedRoute } from '@angular/router';
import { LocaleService } from 'swagular/components';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  FloorValueSettings,
  FloorValueSettingsSchema,
  GeneralSettings,
  GeneralSettingsSchema,
  Settings,
  Source,
  TimingSettings,
  TimingSettingsSchema,
  YesNoQuestionsSettings,
  YesNoQuestionsSettingsSchema
} from 'src/app/api/models';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit {
  generalSettingsFormModel = this.swagularService.getFormModel<GeneralSettings>(GeneralSettingsSchema, {});
  yesNoSettingsFormModel = this.swagularService.getFormModel<YesNoQuestionsSettings>(YesNoQuestionsSettingsSchema, {});
  timingSettingsFormModel = this.swagularService.getFormModel<TimingSettings>(TimingSettingsSchema, {});
  floorValueSettingsFormModel = this.swagularService.getFormModel<FloorValueSettings>(FloorValueSettingsSchema, {});
  panelId?: number;
  oldSettings?: Settings;
  constructor(
    private api: API,
    private swagularService: SwagularService,
    private panelService: PanelService,
    private route: ActivatedRoute,
    private localeService: LocaleService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {
    this.panelId = route.snapshot.params.panelId;
    this.panelService.getSettings(this.panelId!).subscribe(settings => {
      if (!settings) {
        return;
      }
      this.oldSettings = settings;
      this.generalSettingsFormModel.formGroup.setValue(settings.general);
      this.yesNoSettingsFormModel.formGroup.setValue(settings.yesNo);
      this.timingSettingsFormModel.formGroup.setValue(settings.timing);
      this.floorValueSettingsFormModel.formGroup.setValue(settings.floor);
      this.cdr.markForCheck();
    });
  }
  save(formGroup: FormGroup, prop: string) {
    Object.keys(formGroup.controls).forEach(key => {
      if (formGroup.controls[key].dirty) {
        this.oldSettings?.changes.push({
          source: Source.client,
          previewsValue: (this.oldSettings as any)[prop][key],
          path: `${prop}.${key}`
        });
      }
    });
    (this.api as any)
      [`${prop}Settings`](this.panelService.currentPanel?.panelId!, {
        settings: formGroup.value,
        changes: this.oldSettings?.changes!
      })
      .subscribe(() => {
        this.snackBar.open('Settings was saved successfully', '', { duration: 2000 });
      });
  }

  ngOnInit(): void {}
}
