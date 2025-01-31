/*
 * This file is part of NER's FinishLine and licensed under GNU AGPLv3.
 * See the LICENSE file in the repository root folder for details.
 */

import axios from '../utils/axios';
import { Project, WbsNumber } from 'shared';
import { wbsPipe } from '../utils/pipes';
import { apiUrls } from '../utils/urls';
import { projectTransformer } from './transformers/projects.transformers';
import { CreateSingleProjectPayload, EditSingleProjectPayload } from '../utils/types';

/**
 * Fetches all projects.
 */
export const getAllProjects = () => {
  return axios.get<Project[]>(apiUrls.projects(), {
    transformResponse: (data) => JSON.parse(data).map(projectTransformer)
  });
};

/**
 * Fetches a single project.
 *
 * @param wbsNum Project WBS number of the requested project.
 */
export const getSingleProject = (wbsNum: WbsNumber) => {
  return axios.get<Project>(apiUrls.projectsByWbsNum(wbsPipe(wbsNum)), {
    transformResponse: (data) => projectTransformer(JSON.parse(data))
  });
};

/**
 * Create a single project.
 *
 * @param payload Payload containing all information needed to create a project.
 */
export const createSingleProject = (payload: CreateSingleProjectPayload) => {
  return axios.post<{ message: string }>(apiUrls.projectsCreate(), {
    ...payload
  });
};

/**
 * Edit a single project
 *
 * @param payload Payload containing all information needed to edit a project.
 */
export const editSingleProject = (payload: EditSingleProjectPayload) => {
  return axios.post<{ message: string }>(apiUrls.projectsEdit(), {
    ...payload
  });
};

/**
 * Sets the project's team.
 * @param wbsNum the wbsNum of the project
 * @param teamId the id of the team the project is being assigned to
 */
export const setProjectTeam = (wbsNum: WbsNumber, teamId: string) => {
  return axios.post<{ message: string }>(apiUrls.projectsSetTeam(wbsPipe(wbsNum)), {
    teamId
  });
};

/*
 * Delete a project.
 *
 * @param wbsNum The WBS Number of the Project being deleted.
 */
export const deleteProject = (wbsNumber: WbsNumber) => {
  return axios.delete<{ message: string }>(apiUrls.projectsDelete(wbsPipe(wbsNumber)));
};

/**
 * Toggles a user's favorite status on a project
 * @param wbsNum Project WBS number of the requested project to toggle favorite for.
 */
export const toggleProjectFavorite = (wbsNum: WbsNumber) => {
  return axios.post<{ message: string }>(apiUrls.projectsToggleFavorite(wbsPipe(wbsNum)));
};
