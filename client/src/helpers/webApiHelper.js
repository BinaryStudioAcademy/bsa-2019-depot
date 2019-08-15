import * as queryString from 'query-string';
import { toast } from 'react-toastify';

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
    method: args.type,
    headers,
    signal: args.ct,
    ...(args.request === 'GET' ? {} : { body })
  };
}

export async function throwIfResponseFailed(res) {
  if (!res.ok) {
    let parsedException;
    try {
      const response = await res.json();
      if (response.message) parsedException = response.message;
      if (response.status === 404) parsedException = 'Not found';
      if (response.status === 500) parsedException = 'Server is currently unable to handle this request';
    } catch (err) {
      parsedException = 'Something went wrong with request!';
    }
    throw parsedException;
  }
}

export default async function callWebApi(args) {
  try {
    const res = await fetch(getFetchUrl(args), getFetchArgs(args));
    await throwIfResponseFailed(res);
    return res;
  } catch (err) {
    toast.error(err);
    throw err;
  }
}
