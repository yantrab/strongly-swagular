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
}

export const ContactSchema  = {"type":"object","properties":{"index":{"type":"number"},"name1":{"type":"string","maxLength":13},"name2":{"type":"string","maxLength":13},"tel1":{"type":"string","maxLength":15,"pattern":"^[0-9]*$"},"tel2":{"type":"string","maxLength":15,"pattern":"^[0-9]*$"},"tel3":{"type":"string","maxLength":15,"pattern":"^[0-9]*$"},"code":{"type":"string","maxLength":10,"pattern":"^[0-9]*$"},"ref":{"type":"string","maxLength":3,"pattern":"^[0-9]*$"},"apartment":{"type":"string","maxLength":3,"pattern":"^[0-9]*$"}},"required":["index","ref","apartment"]}
