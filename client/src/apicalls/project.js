import { apiRequest } from './index';

export const CreateProject = async (project) =>
  apiRequest('post', '/api/projects/create-project', project);

export const GetAllProjects = async (filters) =>
  apiRequest('post', '/api/projects/get-all-projects', filters);

export const EditProject = async (project) =>
  apiRequest('post', '/api/projects/edit-project', project);

export const DeleteProject = async (id) =>
  apiRequest('delete', '/api/projects/delete-project', { _id: id });

export const GetProjectsByRole = async (userId) =>
  apiRequest('post', '/api/projects/get-projects-by-role', { userId });

export const GetProjectById = async (id) =>
  apiRequest('post', '/api/projects/get-project-by-id', { _id: id });
