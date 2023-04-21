/*
 * This file is part of NER's FinishLine and licensed under GNU AGPLv3.
 * See the LICENSE file in the repository root folder for details.
 */

import { Link } from 'react-router-dom';
import { Project, isGuest, isAdmin } from 'shared';
import { wbsPipe } from '../../../utils/pipes';
import { useAuth } from '../../../hooks/auth.hooks';
import PageTitle from '../../../layouts/PageTitle/PageTitle';
import { routes } from '../../../utils/routes';
import { NERButton } from '../../../components/NERButton';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import EditIcon from '@mui/icons-material/Edit';
import ListItemIcon from '@mui/material/ListItemIcon';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import { Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import LoadingIndicator from '../../../components/LoadingIndicator';
import { useSetProjectTeam } from '../../../hooks/projects.hooks';
import { useToast } from '../../../hooks/toasts.hooks';
import ProjectDetailTabs from './ProjectDetailTabs';
import DeleteProject from '../DeleteProject';
import GroupIcon from '@mui/icons-material/Group';
import DeleteIcon from '@mui/icons-material/Delete';
import { ScopeTab } from './ScopeTab';
import ProjectGantt from './ProjectGantt';
import ProjectChangesList from './ProjectChangesList';
import ProjectDetails from './ProjectDetails';
import TaskList from './TaskList/TaskList';

interface ProjectViewContainerProps {
  proj: Project;
  enterEditMode: () => void;
}

const ProjectViewContainer: React.FC<ProjectViewContainerProps> = ({ proj, enterEditMode }) => {
  const [deleteModalShow, setDeleteModalShow] = useState<boolean>(false);
  const handleDeleteClose = () => setDeleteModalShow(false);
  const handleClickDelete = () => {
    setDeleteModalShow(true);
  };
  const auth = useAuth();
  const toast = useToast();
  const { mutateAsync } = useSetProjectTeam(proj.wbsNum);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tab, setTab] = useState(0);

  if (!auth.user) return <LoadingIndicator />;

  const dropdownOpen = Boolean(anchorEl);
  proj.workPackages.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  const { teamAsLeadId } = auth.user;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  const handleClickEdit = () => {
    enterEditMode();
    handleDropdownClose();
  };

  const handleAssignToMyTeam = async () => {
    try {
      await mutateAsync(teamAsLeadId);
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message);
      }
    }
    handleDropdownClose();
  };

  const editBtn = (
    <MenuItem onClick={handleClickEdit} disabled={isGuest(auth.user.role)}>
      <ListItemIcon>
        <EditIcon fontSize="small" />
      </ListItemIcon>
      Edit
    </MenuItem>
  );

  const createCRBtn = (
    <MenuItem
      component={Link}
      to={routes.CHANGE_REQUESTS_NEW_WITH_WBS + wbsPipe(proj.wbsNum)}
      disabled={isGuest(auth.user.role)}
      onClick={handleDropdownClose}
    >
      <ListItemIcon>
        <SyncAltIcon fontSize="small" />
      </ListItemIcon>
      Request Change
    </MenuItem>
  );

  const assignToMyTeamButton = (
    <MenuItem disabled={proj.team?.teamId === teamAsLeadId} onClick={handleAssignToMyTeam}>
      <ListItemIcon>
        <GroupIcon fontSize="small" />
      </ListItemIcon>
      Assign to My Team
    </MenuItem>
  );

  const deleteButton = (
    <MenuItem onClick={handleClickDelete} disabled={!isAdmin(auth.user.role)}>
      <ListItemIcon>
        <DeleteIcon fontSize="small" />
      </ListItemIcon>
      Delete
    </MenuItem>
  );

  const projectActionsDropdown = (
    <div>
      <NERButton
        endIcon={<ArrowDropDownIcon style={{ fontSize: 28 }} />}
        variant="contained"
        id="project-actions-dropdown"
        onClick={handleClick}
      >
        Actions
      </NERButton>
      <Menu open={dropdownOpen} anchorEl={anchorEl} onClose={handleDropdownClose}>
        {editBtn}
        {createCRBtn}
        {teamAsLeadId && assignToMyTeamButton}
        {deleteButton}
      </Menu>
    </div>
  );

  return (
    <>
      <PageTitle
        title={`${wbsPipe(proj.wbsNum)} - ${proj.name}`}
        previousPages={[{ name: 'Projects', route: routes.PROJECTS }]}
        actionButton={projectActionsDropdown}
      />
      <ProjectDetailTabs project={proj} setTab={setTab} />
      {tab === 0 ? (
        <ProjectDetails project={proj} />
      ) : tab === 1 ? (
        <TaskList project={proj} />
      ) : tab === 2 ? (
        <ScopeTab project={proj} />
      ) : tab === 3 ? (
        <ProjectGantt workPackages={proj.workPackages} />
      ) : (
        <ProjectChangesList changes={proj.changes} />
      )}
      {deleteModalShow && <DeleteProject modalShow={deleteModalShow} handleClose={handleDeleteClose} wbsNum={proj.wbsNum} />}
    </>
  );
};

export default ProjectViewContainer;
