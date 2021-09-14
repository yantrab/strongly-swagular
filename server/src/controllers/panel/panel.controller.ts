import { body, get, post, user } from "strongly";
import { PanelService } from "../../services/panel/panel.service";
import { Role, User } from "../../domain/user";
import { AddPanelDetailsDTO, PanelDetails } from "../../domain/panel/panel.details";
import { omit } from "lodash";

export class PanelController {
  constructor(private service: PanelService) {}
  @get("list") list(@user user: User) {
    return this.service.getPanelList(user.role === Role.admin ? undefined : user._id);
  }

  @post addNewPanel(@body panel: AddPanelDetailsDTO, @user user: User) {
    const toSave = omit(panel, ["id"]) as PanelDetails;
    toSave.userId = user._id!;
    return this.service.saveOrUpdatePanel(toSave);
  }

  @post savePanel(@body panel: PanelDetails) {
    return this.service.saveOrUpdatePanel(panel);
  }
}
