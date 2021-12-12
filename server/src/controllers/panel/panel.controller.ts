import { body, get, guard, params, post, put, query, user } from "strongly";
import { PanelService } from "../../services/panel/panel.service";
import { Role, User } from "../../domain/user";
import { ActionType, AddPanelDetailsDTO, PanelDetails } from "../../domain/panel/panel.details";
import { omit } from "lodash";
import { ChangeItem, Contact } from "../../domain/panel/panel.contacts";
import { PanelSocketService } from "../../services/panel/panel.socket.service";
import { LoggerService } from "../../services/loggerService";
import {
  FloorValueSettings,
  GeneralSettings,
  SettingsChangeItem,
  TimingSettings,
  YesNoQuestionsSettings
} from "../../domain/panel/settings";

@guard(user => !!user)
export class PanelController {
  constructor(private service: PanelService, private panelSocketService: PanelSocketService, private logService: LoggerService) {
    panelSocketService.listen();
  }

  @put(":id/reset") reset(@params("id") id: number) {
    return this.service.reset(id);
  }

  @get(":id/logs") logs(@params("id") id: number) {
    return this.logService.getLogs({ pId: id });
  }

  @get("list") list(@user user: User) {
    return this.service.getPanelList(user.role === Role.admin ? undefined : user._id);
  }

  @post addNewPanel(@body panel: AddPanelDetailsDTO, @user user: User) {
    const toSave = (omit(panel, ["id"]) as unknown) as PanelDetails;
    toSave.userId = user._id!;
    return this.service.addNewPanel(toSave);
  }

  @post
  async savePanel(@body panel: PanelDetails) {
    // if (panel.status === ActionType.writeAllToPanel) {
    //   await this.service.resetChanges(panel);
    // }
    return this.service.saveOrUpdatePanel(panel);
  }

  @get(":id/contacts") contacts(@params("id") id: number) {
    return this.service.getPanelContacts(id);
  }

  @get(":id/settings") settings(@params("id") id: number) {
    return this.service.getPanelSettings(id);
  }

  @post(":id/save-contacts") updateContact(
    @params("id") panelId: number,
    @body("contact") contact: Contact,
    @body("changes") changes: ChangeItem[]
  ) {
    return this.service.updateContact(panelId, contact, changes);
  }

  @get dump(@query panel: PanelDetails) {
    return this.service.dump(panel);
  }

  @post reDump(@body("panel") panel: PanelDetails, @body("dump") dump: string) {
    return this.service.reDump(panel, dump.slice(1));
  }

  @post updateContacts(@body("panelId") panelId: number, @body("contacts") contacts: Contact[], @body("changes") changes?: ChangeItem[]) {
    return this.service.updateContacts(panelId, contacts, changes);
  }

  @put(":id/settings/general") generalSettings(
    @params("id") panelId: number,
    @body("settings") generalSettings: GeneralSettings,
    @body("changes") changes: SettingsChangeItem[]
  ) {
    return this.service.updateSettings(panelId, { general: generalSettings }, changes);
  }

  @put(":id/settings/timing") timingSettings(
    @params("id") panelId: number,
    @body("settings") timingSettings: TimingSettings,
    @body("changes") changes: SettingsChangeItem[]
  ) {
    return this.service.updateSettings(panelId, { timing: timingSettings }, changes);
  }

  @put(":id/settings/questions") yesNoSettings(
    @params("id") panelId: number,
    @body("settings") yesNoQuestions: YesNoQuestionsSettings,
    @body("changes") changes: SettingsChangeItem[]
  ) {
    return this.service.updateSettings(panelId, { yesNo: yesNoQuestions }, changes);
  }

  @put(":id/settings/floorValue") floorSettings(
    @params("id") panelId: number,
    @body("settings") floorSettings: FloorValueSettings,
    @body("changes") changes: SettingsChangeItem[]
  ) {
    return this.service.updateSettings(panelId, { floor: floorSettings }, changes);
  }
}
