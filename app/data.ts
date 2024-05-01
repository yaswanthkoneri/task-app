////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Remix, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { matchSorter } from "match-sorter";
// @ts-ignore - no types, but it's a tiny function
import sortBy from "sort-by";
import invariant from "tiny-invariant";
import { sessionIdSessionStorage } from "./session.server";

type ContactMutation = {
  id?: string;
  first?: string;
  last?: string;
  avatar?: string;
  twitter?: string;
  notes?: string;
  favorite?: boolean;
};

export type ContactRecord = ContactMutation & {
  id: string;
  name: string;
  completed: boolean;
  description: string;
  created_at: string;
  updated_at: string;
};

////////////////////////////////////////////////////////////////////////////////
// This is just a fake DB table. In a real app you'd be talking to a real db or
// fetching from an existing API.
const fakeContacts = {
  records: {} as Record<string, ContactRecord>,

  async getAll(token: string): Promise<ContactRecord[]> {
    const response = await fetch('http://localhost:8000/tasks/list', {
      headers: {
      'Authorization': `Bearer ${token}`
      }
  });
    const data = await response.json();
    return data;
  },

  async getAllSearch(query: string, token:string): Promise<ContactRecord[]> {
    const response = await fetch(`http://localhost:8000/tasks/list?q=${query}`, {
      headers: {
        'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    return data;
  },

  async get(id: string): Promise<ContactRecord | null> {
    return fakeContacts.records[id] || null;
  },

  async set(id: string, values: ContactMutation): Promise<ContactRecord> {
    const contact = await fakeContacts.get(id);
    invariant(contact, `No contact found for ${id}`);
    const updatedContact = { ...contact, ...values };
    fakeContacts.records[id] = updatedContact;
    return updatedContact;
  }
};

export const getJWTToken = async (request: any) => {
  const sessionIdSession = await sessionIdSessionStorage.getSession(request.headers.get('Cookie'));

  const jwtToken = sessionIdSession.get('jwtToken');
  return jwtToken;
}

export const setSession = async (request: any, jwtToken: string) => {
  const sessionIdSession = await sessionIdSessionStorage.getSession(request.headers.get('Cookie'));
  sessionIdSession.set('jwtToken', jwtToken);
  const serializedSession = await sessionIdSessionStorage.commitSession(sessionIdSession, {
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
  });
  return serializedSession
}

////////////////////////////////////////////////////////////////////////////////
// Handful of helper functions to be called from route loaders and actions
export async function getContacts(query?: string | null, token?: string) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  try {
    let contacts
    if (query) {
      contacts = await fakeContacts.getAllSearch(query, token);
      return contacts || []
    }
    contacts = await fakeContacts.getAll(token) || [];

    // console.log("contacts", contacts)
    if (contacts.code === 'token_not_valid') {
      return 401
    }
  
    return contacts?.sort(sortBy("name", "created_at"));
  } catch (err) {
    console.error(err)
    return err
  }

}

export async function getContact(id: string, token: string) {
  const response = await fetch(`http://localhost:8000/tasks/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  return data;
}

export async function updateContact(id: string, updates: ContactMutation, token: string) {
  // const contact = await fakeContacts.get(id);
  // if (!contact) {
  //   throw new Error(`No contact found for ${id}`);
  // }
  // await fakeContacts.set(id, { ...contact, ...updates });
  // return contact;


  const response = await fetch(`http://localhost:8000/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updates)
  });
  const data = await response.json();
  return data;
}

export async function createContact(updates: ContactMutation, token: string) {
  try {
    const response = await fetch(`http://localhost:8000/tasks/list/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err)
    return null
  }
 
 
}

export async function login(body: ContactMutation) {
  try {
    const response = await fetch(`http://localhost:8000/api/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err)
    return null
  }
 
 
}
export async function deleteContact(id: string, token: string) {
  let response = await fetch(`http://localhost:8000/tasks/${id}`, {
    method: 'DELETE',
    headers: {
        'Authorization': `Bearer ${token}`
    }
  });
  
    return response;
}