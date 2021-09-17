import { Contact, Contacts } from "../server/src/domain/panel/panel.contacts";

export const panel = {
  contacts: {
    length: 249,
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

export const reDump = (dump: string, lang: Lang) => {
  const contacts: Contact[] = [];
  for (let i = 0; i < panel.contacts.length; i++) {
    const contact: Contact = {
      index: i,
      name1: sliceContactProperty(dump, panel.contacts.name1.index, i, panel.contacts.name1.length) || undefined,
      name2: sliceContactProperty(dump, panel.contacts.name2.index, i, panel.contacts.name2.length) || undefined,

      tel1: sliceContactProperty(dump, panel.contacts.tel1.index, i, panel.contacts.tel1.length) || undefined,
      tel2: sliceContactProperty(dump, panel.contacts.tel2.index, i, panel.contacts.tel2.length) || undefined,
      tel3: sliceContactProperty(dump, panel.contacts.tel3.index, i, panel.contacts.tel3.length) || undefined,
      tel4: sliceContactProperty(dump, panel.contacts.tel4.index, i, panel.contacts.tel4.length) || undefined,
      tel5: sliceContactProperty(dump, panel.contacts.tel5.index, i, panel.contacts.tel5.length) || undefined,
      tel6: sliceContactProperty(dump, panel.contacts.tel6.index, i, panel.contacts.tel6.length) || undefined,

      code: sliceContactProperty(dump, panel.contacts.code.index, i, panel.contacts.code.length) || undefined,
      ref: sliceContactProperty(dump, panel.contacts.ref.index, i, panel.contacts.ref.length),
      apartment: sliceContactProperty(dump, panel.contacts.apartment.index, i, panel.contacts.apartment.length)
    } as any;

    if (lang === Lang.he) {
      if (contact.name1) contact.name1 = reverse(contact.name1);
      if (contact.name2) contact.name2 = reverse(contact.name2);
    }
    contacts.push(contact);
  }
  return { contacts };
};
