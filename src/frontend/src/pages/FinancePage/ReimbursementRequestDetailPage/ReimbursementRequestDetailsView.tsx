/*
 * This file is part of NER's FinishLine and licensed under GNU AGPLv3.
 * See the LICENSE file in the repository root folder for details.
 */

import { Grid, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { datePipe, fullNamePipe } from '../../../utils/pipes';
import VerticalDetailDisplay from '../../../components/VerticalDetailDisplay';
import PageLayout from '../../../components/PageLayout';
import ReimbursementProductsView from './ReimbursementProductsView';
import { ReimbursementRequest } from 'shared';

interface ReimbursementRequestDetailsViewProps {
  reimbursementRequest: ReimbursementRequest;
}

const ReimbursementRequestDetailsView: React.FC<ReimbursementRequestDetailsViewProps> = ({ reimbursementRequest }) => {
  const theme = useTheme();
  const totalCostBackgroundColor = theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200];

  const BasicInformationView = () => {
    return (
      <>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '5px' }}>
          <Typography variant="h5">Details</Typography>
          <Typography variant="h5" fontSize={24}>{`${datePipe(new Date(reimbursementRequest.dateOfExpense))}`}</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item sm={6} xs={12}>
            <VerticalDetailDisplay label="Purchased From" content={reimbursementRequest.vendor.name} />
          </Grid>
          <Grid item sm={6} xs={12}>
            <VerticalDetailDisplay label="Sabo Number" content={`${reimbursementRequest.saboId ?? '----'}`} />
          </Grid>
          <Grid item sm={6} xs={12}>
            <VerticalDetailDisplay label="Refund Source" content={`${reimbursementRequest.account}`} />
          </Grid>
          <Grid item sm={6} xs={12}>
            <VerticalDetailDisplay label="Expense Type" content={`${reimbursementRequest.expenseType.name}`} />
          </Grid>
          <Grid
            item
            xs={12}
            container
            mt={2}
            ml={2}
            sx={{ backgroundColor: totalCostBackgroundColor, borderRadius: '10px', boxShadow: 1 }}
          >
            <Grid item xs={6} textAlign={'center'} mt={-2}>
              <Typography fontSize={50}>Total Cost</Typography>
            </Grid>
            <Grid xs={6} mt={-2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography fontSize={50}>{`$${reimbursementRequest.totalCost}`}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  };

  const GridDivider = () => {
    return (
      <Box
        sx={{
          height: '100%',
          borderColor: theme.palette.divider,
          borderWidth: '2px',
          borderStyle: 'solid',
          width: '0px',
          textAlign: 'center'
        }}
      />
    );
  };

  const ReceiptsView = () => {
    return (
      <Box sx={{ maxHeight: `250px`, overflow: reimbursementRequest.receiptPictures.length > 0 ? 'auto' : 'none' }}>
        <Typography variant="h5">Receipts</Typography>
        {reimbursementRequest.receiptPictures.map((receipt) => {
          return (
            <iframe
              style={{ height: `200px`, width: '50%' }}
              src={`https://drive.google.com/file/d/${receipt.googleFileId}/preview`}
              title={receipt.name}
            />
          );
        })}
      </Box>
    );
  };

  return (
    <PageLayout title={`${fullNamePipe(reimbursementRequest.recipient)}'s Reimbursement Request`} previousPages={[]}>
      <Grid container spacing={2} mt={2}>
        <Grid item lg={6} xs={12}>
          <BasicInformationView />
        </Grid>
        <Grid item lg={1} xs={0} justifyContent={'center'} display={'flex'}>
          <GridDivider />
        </Grid>
        <Grid item lg={5} xs={12} rowSpacing={5} container>
          <Grid item xs={12}>
            <ReceiptsView />
          </Grid>
          <Grid item xs={12}>
            <ReimbursementProductsView reimbursementRequest={reimbursementRequest} />
          </Grid>
        </Grid>
      </Grid>
    </PageLayout>
  );
};

export default ReimbursementRequestDetailsView;
