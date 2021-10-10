import { body, get, guard, params, post, user, query } from "strongly";
import { PanelService } from "../../services/panel/panel.service";
import { Role, User } from "../../domain/user";
import { AddPanelDetailsDTO, PanelDetails } from "../../domain/panel/panel.details";
import { omit } from "lodash";
import { ChangeItem, Contact } from "../../domain/panel/panel.contacts";
import { PanelSocketService } from "../../services/panel/panel.socket.service";

@guard(user => !!user)
export class PanelController {
  constructor(private service: PanelService, private panelSocketService: PanelSocketService) {
    panelSocketService.listen();
  }
  @get("list") list(@user user: User) {
    return this.service.getPanelList(user.role === Role.admin ? undefined : user._id);
  }

  @post addNewPanel(@body panel: AddPanelDetailsDTO, @user user: User) {
    const toSave = omit(panel, ["id"]) as PanelDetails;
    toSave.userId = user._id!;
    return this.service.addNewPanel(toSave);
  }

  @post savePanel(@body panel: PanelDetails) {
    return this.service.saveOrUpdatePanel(panel);
  }

  @get(":id/contacts") contacts(@params("id") id: number) {
    return this.service.getPanelContacts(id);
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
}
