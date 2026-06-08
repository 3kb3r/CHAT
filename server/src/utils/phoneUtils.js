export const phoneValidationRules = {
  operators: {
    bakcell: /^(994|0)(50|51|55|70|77)\d{7}$/,
    azercell: /^(994|0)(10|40|41|50|60|70)\d{7}$/,
    veon: /^(994|0)(70|71)\d{7}$/,
    nar: /^(994|0)(40|41)\d{7}$/
  },
  
  landline: /^(994|0)(1|2|3|4|5|6|8|9)\d{8}$/
};

export const getOperator = (phoneNumber) => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  for (const [operator, regex] of Object.entries(phoneValidationRules.operators)) {
    if (regex.test(cleaned)) {
      return operator;
    }
  }
  
  if (phoneValidationRules.landline.test(cleaned)) {
    return 'landline';
  }
  
  return null;
};

export const cleanPhoneNumber = (phoneNumber) => {
  let cleaned = phoneNumber.replace(/\s/g, '').replace(/[-()]/g, '');
  
  if (cleaned.startsWith('+994')) {
    cleaned = '994' + cleaned.substring(4);
  } else if (cleaned.startsWith('0994')) {
    cleaned = '994' + cleaned.substring(4);
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = '994' + cleaned.substring(1);
  } else if (!cleaned.startsWith('994')) {
    if (cleaned.length === 10) {
      cleaned = '994' + cleaned;
    }
  }
  
  return cleaned;
};

export const formatPhoneNumber = (phoneNumber, format = '+994') => {
  const cleaned = cleanPhoneNumber(phoneNumber);
  
  if (!cleaned.startsWith('994')) {
    return null;
  }
  
  const formattedNumber = '994' + cleaned.substring(3);
  
  switch (format) {
    case '+994':
      return '+' + formattedNumber;
    case '0':
      return '0' + formattedNumber.substring(3);
    case '994':
      return formattedNumber;
    default:
      return '+' + formattedNumber;
  }
};

export const maskPhoneNumber = (phoneNumber) => {
  const cleaned = cleanPhoneNumber(phoneNumber);
  if (cleaned.length === 12) {
    return `+${cleaned.substring(0, 3)} (${cleaned.substring(3, 5)}) ${cleaned.substring(5, 8)}-${cleaned.substring(8, 10)}-${cleaned.substring(10)}`;
  }
  return phoneNumber;
};

export const isValidPhoneNumber = (phoneNumber) => {
  const cleaned = cleanPhoneNumber(phoneNumber);
  return cleaned.length === 12 && cleaned.startsWith('994');
};

export const examplePhoneNumbers = {
  bakcell: '+994501234567',
  azercell: '+994701234567',
  veon: '+994701234567',
  nar: '+994401234567',
  landline: '+9941234567890'
};

export const getPhoneType = (phoneNumber) => {
  const cleaned = cleanPhoneNumber(phoneNumber);
  
  if (phoneValidationRules.landline.test(cleaned)) {
    return 'landline';
  }
  
  if (/^994(50|51|55|70|77|9)/.test(cleaned)) {
    return 'mobile';
  }
  
  return null;
};