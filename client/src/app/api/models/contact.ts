export interface Contact {
  apartment: string;
  code?: string;
  index: number;
  name1?: string;
  name2?: string;
  ref: string;
  tel1?: string;
  tel2?: string;
  tel3?: string;
  tel4?: string;
  tel5?: string;
  tel6?: string;
}

export const ContactSchema  = {"type":"object","properties":{"index":{"type":"number"},"name1":{"type":"string","maxLength":13},"name2":{"type":"string","maxLength":13},"tel1":{"type":"string","maxLength":15,"pattern":"^[0-9f\\-*#]*$"},"tel2":{"type":"string","maxLength":15,"pattern":"^[0-9f\\-*#]*$"},"tel3":{"type":"string","maxLength":15,"pattern":"^[0-9f\\-*#]*$"},"tel4":{"type":"string","maxLength":15,"pattern":"^[0-9f\\-*#]*$"},"tel5":{"type":"string","maxLength":15,"pattern":"^[0-9f\\-*#]*$"},"tel6":{"type":"string","maxLength":15,"pattern":"^[0-9f\\-*#]*$"},"code":{"type":"string","maxLength":10,"pattern":"^[0-9]*$"},"ref":{"type":"string","maxLength":3,"pattern":"^[0-9]*$"},"apartment":{"type":"string","maxLength":3,"pattern":"^[0-9]*$"}},"required":["index","ref","apartment"]}
