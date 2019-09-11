import * as queryString from 'query-string';

function getFetchUrl(args) {
  return args.endpoint + (args.query ? `?${queryString.stringify(args.query)}` : '');
}

function getFetchArgs(args) {
  const headers = {};
  if (!args.attachment) {
    headers['Content-Type'] = 'application/json';
    headers.Accept = 'application/json';
  }
  const token = localStorage.getItem('token');
  if (token && !args.skipAuthorization) {
    headers.Authorization = `Bearer ${token}`;
  }
  let body;
  if (args.attachment) {
    if (args.type === 'GET') {
      throw new Error('GET request does not support attachments.');
    }
    const formData = new FormData();
    formData.append('image', args.attachment);
    body = formData;
  } else if (args.request) {
    if (args.type === 'GET') {
      throw new Error('GET request does not support request body.');
    }
    body = JSON.stringify(args.request);
  }
  return {
    ...(args.request === 'GET' ? {} : { body }),
    method: args.type,
    headers,
    signal: args.ct,
    mode: args.mode
  };
}

export async function throwIfResponseFailed(res) {
  if (!res.ok) {
    let parsedException = { status: 500, message: 'Something went wrong with request!' };
    try {
      parsedException = await res.json();
    } catch (err) {}
    throw parsedException;
  }
}

export function handleError(err) {
  if (err.status === 404) {
    window.location.href = '/not-found';
  }
}

export default async function callWebApi(args) {
  try {
    const res = await fetch(getFetchUrl(args), getFetchArgs(args));
    if (args.endpoint !== '/api/auth/user') await throwIfResponseFailed(res);
    return res;
  } catch (err) {
    //toast.error(`Status: ${err.status}. ${err.message}`);
    console.error(`Status: ${err.status}. ${err.message}`);
    handleError(err);
  }
}

export async function callExternalApi(args) {
  try {
    return fetch(getFetchUrl(args));
  } catch (err) {
    //toast.error(`Status: ${err.status}. ${err.message}`);
    console.error(`Status: ${err.status}. ${err.message}`);
  }
}
