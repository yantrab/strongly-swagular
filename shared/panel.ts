export function getContactChanges(contact: any, oldContact: any, source: number) {
  const changes: any = [];
  Object.keys(contact).forEach(key => {
    if (contact[key] !== oldContact[key] || (contact[key] && !oldContact[key])) {
      changes.push({ index: contact.index, key, previewsValue: oldContact[key], source: source });
    }
  });
  return changes;
}

export function getContactsChanges(contacts: any, oldContacts: any, source: number) {
  const changes: any[] = [];
  contacts.forEach((contact: any) => {
    changes.push(...getContactChanges(contact, oldContacts[contact.index], source));
  });
  return changes;
}
