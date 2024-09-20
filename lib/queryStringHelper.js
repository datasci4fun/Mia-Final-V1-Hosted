// C:\Users\blixa\Documents\xampp\git\Mia-Final-V1\lib\queryStringHelper.js

// Allowed query parameters to be preserved across routes
const allowedParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'mid', 'gclid', 'source'];

export function getAllowedParams() {
  return allowedParams;
}

export function generateUrlWithQueryString(url, params) {
  if (Object.keys(params).length) {
    const filteredParams = filterAllowedParams(params);
    if (Object.keys(filteredParams).length) {
      if (url[0] !== '/') url = `/${url}`;
      return `${url}?${serialize(filteredParams)}`;
    }
    return url;
  }
  return url;
}

export function filterAllowedParams(params) {
  if (Object.keys(params).length) {
    return Object.keys(params)
      .filter((key) => getAllowedParams().includes(key.toLowerCase()))
      .reduce((obj, key) => {
        obj[key] = params[key];
        return obj;
      }, {});
  }
  return params;
}

// INTERNAL - Serialize object to query string
function serialize(obj) {
  return Object.keys(obj)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&');
}
