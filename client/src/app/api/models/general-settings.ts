export interface GeneralSettings {
  commSpd: number;
  confirmTone: string;
  extKeys: number;
  extra: string;
  familyNo: number;
  fastStep: number;
  masterCode: string;
  offset: number;
  relay1MeM: number;
  relay2MeM: number;
  speechLevel: number;
  tecUserCode: string;
  toneCode1: string;
  toneCode2: string;
}

export const GeneralSettingsSchema = {
  type: 'object',
  properties: {
    masterCode: { type: 'string', maxLength: 10, pattern: '^[0-9]*$' },
    tecUserCode: { type: 'string', maxLength: 10, pattern: '^[0-9]*$' },
    extKeys: { type: 'number', minimum: 0, maximum: 99 },
    fastStep: { type: 'number', minimum: 0, maximum: 9 },
    offset: { type: 'number', minimum: 0, maximum: 9999 },
    commSpd: { type: 'number', minimum: 0, maximum: 9 },
    familyNo: { type: 'number', minimum: 0, maximum: 9 },
    relay1MeM: { type: 'number', minimum: 0, maximum: 250 },
    relay2MeM: { type: 'number', minimum: 0, maximum: 250 },
    speechLevel: { type: 'number', minimum: 0, maximum: 7 },
    toneCode1: { type: 'string', pattern: '^[0-9\\-]$' },
    toneCode2: { type: 'string', pattern: '^[0-9\\-]$' },
    confirmTone: { type: 'string', pattern: '^[0-7\\-]$' },
    extra: { type: 'string' }
  },
  required: [
    'masterCode',
    'tecUserCode',
    'extKeys',
    'fastStep',
    'offset',
    'commSpd',
    'familyNo',
    'relay1MeM',
    'relay2MeM',
    'speechLevel',
    'toneCode1',
    'toneCode2',
    'confirmTone'
  ]
};
