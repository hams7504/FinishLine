import { Box } from '@mui/system';
import { ReactElement, useState } from 'react';
import { NERButton } from './NERButton';
import { ArrowDropDown } from '@mui/icons-material';
import { ListItemIcon, Menu, MenuItem } from '@mui/material';

export type ButtonInfo = {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: ReactElement;
};

interface ActionsMenuProps {
  buttons: ButtonInfo[];
}

const ActionsMenu: React.FC<ActionsMenuProps> = ({ buttons }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  const dropdownOpen = Boolean(anchorEl);

  return (
    <Box>
      <NERButton
        endIcon={<ArrowDropDown style={{ fontSize: 28 }} />}
        variant="contained"
        id="reimbursement-request-actions-dropdown"
        onClick={handleClick}
      >
        Actions
      </NERButton>
      <Menu open={dropdownOpen} anchorEl={anchorEl} onClose={handleDropdownClose}>
        {buttons.map((button, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              handleDropdownClose();
              button.onClick();
            }}
            disabled={button.disabled}
          >
            <ListItemIcon>{button.icon}</ListItemIcon>
            {button.title}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default ActionsMenu;
