import { Tab, Tabs } from '@mui/material';
import { Link as RouterLink, useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { NERButton } from '../../components/NERButton';
import { useEffect, useMemo, useState } from 'react';
import { routes } from '../../utils/routes';
import { isGuest } from 'shared';
import { Add } from '@mui/icons-material';
import { useCurrentUser } from '../../hooks/users.hooks';
import ChangeRequestsOverview from './ChangeRequestsOverview';
import ChangeRequestsTable from './ChangeRequestsTable';
import PageLayout from '../../components/PageLayout';

const ChangeRequestsView: React.FC = () => {
  const history = useHistory();
  const user = useCurrentUser();

  // Values that go in the URL depending on the tab value
  const viewUrlValues = useMemo(() => ['overview', 'all'], []);

  const match = useRouteMatch<{ tabValueString: string }>(`${routes.CHANGE_REQUESTS}/:tabValueString`);
  const tabValueString = match?.params?.tabValueString;

  // Default to the "overview" tab
  const initialValue: number = viewUrlValues.indexOf(tabValueString ?? 'overview');
  const [tabIndex, setTabIndex] = useState<number>(initialValue);

  // Change tab when the browser forward/back button is pressed
  const { pathname } = useLocation();
  useEffect(() => {
    const newTabValue: number = viewUrlValues.indexOf(tabValueString ?? 'overview');
    setTabIndex(newTabValue);
  }, [pathname, setTabIndex, viewUrlValues, tabValueString]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number): void => {
    setTabIndex(newValue);
  };

  const tabs = (
    <Tabs value={tabIndex} onChange={handleTabChange} variant="standard" aria-label="change-request-tabs">
      <Tab
        label="Overview"
        aria-label="overview"
        value={0}
        component={RouterLink}
        to={`${routes.CHANGE_REQUESTS_OVERVIEW}`}
      />
      <Tab
        label="All Change Requests"
        aria-label="all-change-requests"
        value={1}
        component={RouterLink}
        to={`${routes.ALL_CHANGE_REQUESTS}`}
      />
    </Tabs>
  );

  const headerRight = (
    <NERButton
      variant="contained"
      disabled={isGuest(user.role)}
      startIcon={<Add />}
      onClick={() => history.push(routes.CHANGE_REQUESTS_NEW)}
    >
      New Change Request
    </NERButton>
  );

  return (
    <PageLayout title="Change Requests" tabs={tabs} headerRight={headerRight}>
      {tabIndex === 0 ? <ChangeRequestsOverview /> : <ChangeRequestsTable />}
    </PageLayout>
  );
};

export default ChangeRequestsView;
