export function saveCookie (name, value, expiration, domain) {
  if (!name || !value) {
    return false;
  }

  let cookieParams = `${name}=${value}`;
  if (domain) {
    cookieParams += `;domain=${domain}`;
  }
  cookieParams += ';path=/';
  let expirationString = `${expiration}`;
  expirationString = expirationString.substr(0, expirationString.lastIndexOf('('));
  expirationString += 'GMT';
  if (expiration) {
    cookieParams += `;expires=${expirationString};`;
  }
  document.cookie = cookieParams;
  return true;
}

export function deleteCookies (cookies) {
  const cookieNames = [...cookies];
  cookieNames.map(function (cookie) {
    document.cookie = `${cookie}=;domain=.groundlink.com;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  });
}

export function readCookie (name) {
  return (document.cookie.match('(^|; )' + name + '=([^;]*)') || 0)[2];
}
