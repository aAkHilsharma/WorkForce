import { apiRequest } from '.';

export const CreateTask = async (task) =>
  apiRequest('post', '/api/tasks/create-task', task);

export const GetAllTasks = async (filters) =>
  apiRequest('post', '/api/tasks/get-all-tasks', filters);
