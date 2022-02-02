import { Entity } from "../entity";
import { PanelDetails } from "./panel.details";
import { Contact, Contacts } from "./panel.contacts";
import { dumps } from "./initial-damps";
import { Settings } from "./settings";

export const panelPropertiesSetting = {
  contactsLength: 249,
  contacts: {
    name1: { length: 16, index: 2551 },
    name2: { length: 16, index: 6551 },

    tel1: { length: 15, index: 36382 },
    tel2: { length: 15, index: 40132 },
    tel3: { length: 15, index: 43882 },

    code: { length: 10, index: 51 },
    ref: { length: 3, index: 10551 },
    apartment: { length: 3, index: 35631 }
  },
  settings: {
    general: {
      masterCode: { length: 10, index: 31 },
      tecUserCode: { length: 10, index: 41 },
      extKeys: { length: 2, index: 11337 },
      fastStep: { length: 1, index: 35553 },
      offset: { length: 4, index: 35627 },
      commSpd: { length: 1, index: 36381 },
      familyNo: { length: 1, index: 58995 },
      relay1MeM: { length: 1, index: 62201 },
      relay2MeM: { length: 1, index: 62202 },
      speechLevel: { length: 1, index: 35554 },
      toneCode1: { length: 1, index: 58902 },
      toneCode2: { length: 1, index: 58903 },
      confirmTone: { length: 1, index: 58904 },
      extra: { length: 3328, index: 62203 }
      // dialer1: { length: 16, index: 58910 },
      // dialer2: {},
      // relay1: {},
      // relay2: {}
    },
    timing: {
      delayT: { length: 2, index: 11301 },
      doorT: { length: 2, index: 11303 },
      delayT2: { length: 2, index: 11305 },
      doorT2: { length: 2, index: 11307 },
      illuminationT: { length: 2, index: 11309 },
      ringT: { length: 2, index: 11311 },
      cameraT: { length: 2, index: 11313 },
      proxyT: { length: 2, index: 11315 },
      fDooR: { length: 2, index: 11317 },
      detAnN: { length: 2, index: 11319 },
      nameAnN: { length: 2, index: 11321 },
      floorAnn: { length: 2, index: 11323 },
      nameList: { length: 2, index: 11325 },
      selName: { length: 2, index: 11327 },
      selClear: { length: 2, index: 11329 },
      speech: { length: 2, index: 11331 },
      busyRing: { length: 2, index: 11333 },
      confirm: { length: 2, index: 11335 },

      RingingNum: { length: 2, index: 58882 },
      busyTone1: { length: 2, index: 58884 },
      busyTone2: { length: 2, index: 58886 },
      busyLvL: { length: 2, index: 58888 },
      busyFreQ: { length: 2, index: 58890 },
      lowRingFreq: { length: 2, index: 58892 },
      highRingFreq: { length: 2, index: 58894 },
      breakBetweenRings: { length: 2, index: 58896 },
      ringsToMovE: { length: 2, index: 58898 },
      busyBeforeHang: { length: 2, index: 58900 }
    },
    yesNo: {
      entryMessage: { length: 1, index: 35339 },
      stageMessage: { length: 1, index: 35340 },
      closeDoorMes: { length: 1, index: 35341 },
      nameAnnounce: { length: 1, index: 35342 },
      doorForgetMes: { length: 1, index: 35343 },
      welcomeByDet: { length: 1, index: 35344 },
      ringingMes: { length: 1, index: 35345 },
      openDoorMe: { length: 1, index: 35346 },
      apartmentS: { length: 1, index: 35347 },
      detectorBL: { length: 1, index: 35348 },
      proxy1R1: { length: 1, index: 35349 },
      proxy1R2: { length: 1, index: 35350 },
      proxy2R1: { length: 1, index: 35351 },
      proxy2R2: { length: 1, index: 35352 },
      proxyNpiN: { length: 1, index: 35353 },
      atoZ: { length: 1, index: 35354 },
      externalPxY: { length: 1, index: 35355 },
      elevatorCnT: { length: 1, index: 35356 },
      usingRTC: { length: 1, index: 35357 },
      displayTelVaL: { length: 1, index: 35358 },
      buzOnRlZ: { length: 1, index: 35359 },
      noApNoOf: { length: 1, index: 35360 },
      directDial: { length: 1, index: 35361 },
      fullMenu: { length: 1, index: 35362 }
    },
    floor: {
      floorValue1: { length: 3, index: 35363 },
      floorValue2: { length: 3, index: 35366 },
      floorValue3: { length: 3, index: 35369 },
      floorValue4: { length: 3, index: 35372 },
      floorValue5: { length: 3, index: 35375 },
      floorValue6: { length: 3, index: 35378 },
      floorValue7: { length: 3, index: 35381 },
      floorValue8: { length: 3, index: 35384 },
      floorValue9: { length: 3, index: 35387 },
      floorValue10: { length: 3, index: 35390 },
      floorValue11: { length: 3, index: 35393 },
      floorValue12: { length: 3, index: 35396 },
      floorValue13: { length: 3, index: 35399 },
      floorValue14: { length: 3, index: 35402 },
      floorValue15: { length: 3, index: 35405 },
      floorValue16: { length: 3, index: 35408 },
      floorValue17: { length: 3, index: 35411 },
      floorValue18: { length: 3, index: 35414 },
      floorValue19: { length: 3, index: 35417 },
      floorValue20: { length: 3, index: 35420 },
      floorValue21: { length: 3, index: 35423 },
      floorValue22: { length: 3, index: 35426 },
      floorValue23: { length: 3, index: 35429 },
      floorValue24: { length: 3, index: 35432 },
      floorValue25: { length: 3, index: 35435 },
      floorValue26: { length: 3, index: 35438 },
      floorValue27: { length: 3, index: 35441 },
      floorValue28: { length: 3, index: 35444 },
      floorValue29: { length: 3, index: 35447 },
      floorValue30: { length: 3, index: 35450 }
    }
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
  settings: Settings;

  reDump(dump: string) {
    // contacts
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

    // settings
    const settings = { changes: this.settings?.changes || [], panelId: this.details.panelId };
    Object.keys(panelPropertiesSetting.settings).forEach(key => {
      settings[key] = {};
      Object.keys(panelPropertiesSetting.settings[key]).forEach(prop => {
        const propS = panelPropertiesSetting.settings[key][prop];
        settings[key][prop] = dump.slice(propS.index, propS.index + propS.length).trim();
      });
    });
    this.settings = settings as Settings;
    return this;
  }

  dump() {
    const arr = dumps.MP[this.details.direction].split("");

    // contacts
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

    // settings
    Object.keys(panelPropertiesSetting.settings).forEach(key => {
      Object.keys(panelPropertiesSetting.settings[key]).forEach(prop => {
        let value = this.settings[key][prop].toString();
        const propS = panelPropertiesSetting.settings[key][prop];
        value = (value + " ".repeat(propS.length)).slice(0, propS.length).split("");
        const jInit = propS.index;
        for (let j = 0; j < propS.length; j++) {
          arr[jInit + j] = value[j] || " ";
        }
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
