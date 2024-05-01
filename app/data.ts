import sortBy from "sort-by";
import { sessionIdSessionStorage } from "./session.server";
const BASE_URL = 'http://13.201.22.37:8000'

type TaskMutation = {
  id?: string;
  name: string;
  description:string;
  completed: boolean;
  created_at?: string;
  updated_at?: string;
};

export type TaskRecord = TaskMutation & {
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
const TaskApi = {
  records: {} as Record<string, TaskRecord>,

  async getAll(token: string): Promise<TaskRecord[]> {
    const response = await fetch(`${BASE_URL}/tasks/list`, {
      headers: {
      'Authorization': `Bearer ${token}`
      }
  });
    const data = await response.json();
    return data;
  },

  async getAllSearch(query: string, token:string): Promise<TaskRecord[]> {
    const response = await fetch(`${BASE_URL}/tasks/list?q=${query}`, {
      headers: {
        'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    return data;
  },

 
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
export async function getTasks(query?: string | null, token?: string) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  try {
    let tasks
    if (query) {
      tasks = await TaskApi.getAllSearch(query, token);
      return tasks || []
    }
    tasks = await TaskApi.getAll(token) || [];

    if (tasks.code === 'token_not_valid') {
      return 401
    }
  
    return tasks?.sort(sortBy("name", "created_at"));
  } catch (err) {
    console.error(err)
    return err
  }

}

export async function getTask(id: string, token: string) {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  return data;
}

export async function updateTask(id: string, updates: TaskMutation, token: string) {
 


  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
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

export async function createTask(updates: TaskMutation, token: string) {
  try {
    const response = await fetch(`${BASE_URL}/tasks/list/`, {
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

export async function login(body: TaskMutation) {
  try {
    const response = await fetch(`${BASE_URL}/api/token/`, {
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
export async function deleteTask(id: string, token: string) {
  let response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: {
        'Authorization': `Bearer ${token}`
    }
  });
  
    return response;
}