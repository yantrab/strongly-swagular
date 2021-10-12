import { Entity } from "../entity";
import { PanelDetails } from "./panel.details";
import { Contact, Contacts } from "./panel.contacts";
import { dumps } from "./initial-damps";
export const panelPropertiesSetting = {
  contactsLength: 249,
  contacts: {
    name1: { length: 16, index: 2551 },
    name2: { length: 16, index: 6551 },

    tel1: { length: 15, index: 36382 },
    tel2: { length: 15, index: 40132 },
    tel3: { length: 15, index: 43882 },
    tel4: { length: 15, index: 47632 },
    tel5: { length: 15, index: 51382 },
    tel6: { length: 15, index: 55132 },

    code: { length: 10, index: 51 },
    ref: { length: 3, index: 10551 },
    apartment: { length: 3, index: 35631 }
  }
};
function sliceContactProperty(dump: string, startIndex: number, index: number, length: number) {
  const start = startIndex + index * length;
  const end = start + length;
  return dump.slice(start, end).trim();
}

function reverse(name: string) {
  const arr = name.match(/[A-Za-z0-9]+[A-Za-z0-9 ]*[A-Za-z0-9]+/g);
  if (!arr) return name;
  arr.forEach(r => {
    name = name.replace(
      r,
      r
        .split("")
        .reverse()
        .join("")
    );
  });
  return name;
}

enum Lang {
  he = "Hebrew",
  en = "English"
}
export class Panel extends Entity<Panel> {
  details: PanelDetails;
  contacts: Contacts;

  reDump(dump: string) {
    const contacts: Contact[] = [];
    for (let i = 0; i < panelPropertiesSetting.contactsLength; i++) {
      const contact: Contact = {
        index: i,
        name1:
          sliceContactProperty(dump, panelPropertiesSetting.contacts.name1.index, i, panelPropertiesSetting.contacts.name1.length) ||
          undefined,
        name2:
          sliceContactProperty(dump, panelPropertiesSetting.contacts.name2.index, i, panelPropertiesSetting.contacts.name2.length) ||
          undefined,

        tel1:
          sliceContactProperty(dump, panelPropertiesSetting.contacts.tel1.index, i, panelPropertiesSetting.contacts.tel1.length) ||
          undefined,
        tel2:
          sliceContactProperty(dump, panelPropertiesSetting.contacts.tel2.index, i, panelPropertiesSetting.contacts.tel2.length) ||
          undefined,
        tel3:
          sliceContactProperty(dump, panelPropertiesSetting.contacts.tel3.index, i, panelPropertiesSetting.contacts.tel3.length) ||
          undefined,
        tel4:
          sliceContactProperty(dump, panelPropertiesSetting.contacts.tel4.index, i, panelPropertiesSetting.contacts.tel4.length) ||
          undefined,
        tel5:
          sliceContactProperty(dump, panelPropertiesSetting.contacts.tel5.index, i, panelPropertiesSetting.contacts.tel5.length) ||
          undefined,
        tel6:
          sliceContactProperty(dump, panelPropertiesSetting.contacts.tel6.index, i, panelPropertiesSetting.contacts.tel6.length) ||
          undefined,

        code:
          sliceContactProperty(dump, panelPropertiesSetting.contacts.code.index, i, panelPropertiesSetting.contacts.code.length) ||
          undefined,
        ref: sliceContactProperty(dump, panelPropertiesSetting.contacts.ref.index, i, panelPropertiesSetting.contacts.ref.length),
        apartment: sliceContactProperty(
          dump,
          panelPropertiesSetting.contacts.apartment.index,
          i,
          panelPropertiesSetting.contacts.apartment.length
        )
      } as any;

      if (this.details.direction === Lang.he) {
        if (contact.name1) contact.name1 = reverse(contact.name1);
        if (contact.name2) contact.name2 = reverse(contact.name2);
      }
      contacts.push(contact);
    }
    this.contacts = { list: contacts, changes: this.contacts?.changes || [], panelId: this.details.panelId };
    return this;
  }

  dump() {
    const arr = dumps.MP[this.details.direction].split("");
    Object.keys(panelPropertiesSetting.contacts).forEach(key => {
      const index = panelPropertiesSetting.contacts[key].index;
      const fieldLength = panelPropertiesSetting.contacts[key].length;
      const all = this.contacts.list
        .map(c => {
          let result = c[key] || "";

          // prefix
          if (key.startsWith("name")) {
            if (this.details.direction === Lang.he) result = "    " + result;
            else result = "   " + result;
          }

          // postfix
          result = (result + " ".repeat(fieldLength)).slice(0, fieldLength);

          if (key.startsWith("name") && this.details.direction === Lang.he) {
            result = this.reverse(result);
          }
          return result;
        })
        .join("");
      all.split("").forEach((c, i) => {
        arr[index + i] = c;
      });
    });

    return arr.join("");
  }

  private reverse(name: string) {
    const arr = name.match(/[A-Za-z0-9]+[A-Za-z0-9 ]*[A-Za-z0-9]+/g);
    if (!arr) return name;
    arr.forEach(r => {
      name = name.replace(
        r,
        r
          .split("")
          .reverse()
          .join("")
      );
    });
    return name;
  }
}
