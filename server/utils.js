function cleanResponseString(responseString) {
  return responseString.replace(/```json\n|\n```|```html/g, "").trim();
}

function parseAndCleanObject(obj) {
  const result = {};

  Object.keys(obj).forEach((key) => {
    const value = obj[key];

    if (
      typeof value === "boolean" ||
      (typeof value === "string" && isUrl(value)) ||
      Array.isArray(value)
    ) {
      return;
    }

    if (typeof value === "object" && value !== null) {
      const cleanedValue = parseAndCleanObject(value);
      if (Object.keys(cleanedValue).length > 0) {
        result[key] = cleanedValue;
      }
    } else {
      result[key] = value;
    }
  });

  return result;
}

function isUrl(str) {
  try {
    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
}

module.exports = {
  cleanResponseString,
  parseAndCleanObject,
};
