import * as queryString from 'query-string';
import { toast } from 'react-toastify';

import storageHelper from './storageHelper';

function getFetchUrl(args) {
  return args.endpoint + (args.query ? `?${queryString.stringify(args.query)}` : '');
}

async function getFetchArgs(args) {
  const headers = {};
  if (!args.attachment) {
    headers['Content-Type'] = 'application/json';
    headers.Accept = 'application/json';
  }
  const token = await storageHelper.get('token');
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
    let parsedException = { status: 500, message: 'Something went wrong with request!' };
    try {
      parsedException = await res.json();
    } catch (err) {}
    throw parsedException;
  }
}

export default async function callWebApi(args) {
  try {
    const res = await fetch(getFetchUrl(args), await getFetchArgs(args));
    if (args.endpoint !== '/api/auth/users') await throwIfResponseFailed(res);
    return res;
  } catch (err) {
    toast.error(`Status: ${err.status}. ${err.message}`);
  }
}
