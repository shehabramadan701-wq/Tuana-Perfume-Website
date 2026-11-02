// The logged-in dashboard user, saved in the browser.
//   getUser()            -> { name, email, role, permissions: [...] } or null
//   can('products.add')  -> true / false   (permissions come from server/permissions.js)

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem('tuana_user'));
  } catch {
    return null;
  }
}

export function saveLogin(token, user) {
  localStorage.setItem('tuana_token', token);
  localStorage.setItem('tuana_user', JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem('tuana_token');
  localStorage.removeItem('tuana_user');
}

export function can(permission) {
  return Boolean(getUser()?.permissions?.includes(permission));
}
