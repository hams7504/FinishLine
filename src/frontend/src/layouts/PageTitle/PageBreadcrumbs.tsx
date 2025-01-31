/*
 * This file is part of NER's FinishLine and licensed under GNU AGPLv3.
 * See the LICENSE file in the repository root folder for details.
 */

import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { MUILinkItem } from '../../utils/types';
import { Breadcrumbs } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface PageTitleProps {
  currentPageTitle: string;
  previousPages: MUILinkItem[];
}

// Common component for adding breadcrumbs to a page
const PageBreadcrumbs: React.FC<PageTitleProps> = ({ currentPageTitle, previousPages }) => {
  return (
    <Breadcrumbs sx={{ my: 1 }}>
      {previousPages.map((page, i) => (
        <Link component={RouterLink} key={i} to={page.route}>
          {page.name}
        </Link>
      ))}
      {previousPages.length > 0 && <Typography>{currentPageTitle}</Typography>}
    </Breadcrumbs>
  );
};

export default PageBreadcrumbs;
