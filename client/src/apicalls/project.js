import { apiRequest } from './index';

export const CreateProject = async (project) =>
  apiRequest('post', '/api/projects/create-project', project);

export const GetAllProjects = async (filters) =>
  apiRequest('post', '/api/projects/get-all-projects', filters);
