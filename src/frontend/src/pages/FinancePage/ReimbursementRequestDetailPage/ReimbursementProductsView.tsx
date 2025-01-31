import { Chip, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { getUniqueWbsElementsWithProductsFromReimbursementRequest } from '../../../utils/reimbursement-request.utils';
import { ReimbursementRequest } from 'shared';

interface ReimbursementRequestProductsViewProps {
  reimbursementRequest: ReimbursementRequest;
}

const ReimbursementProductsView: React.FC<ReimbursementRequestProductsViewProps> = ({ reimbursementRequest }) => {
  const uniqueWbsElementsWithProducts = getUniqueWbsElementsWithProductsFromReimbursementRequest(reimbursementRequest);

  const keys = [];
  for (const key of uniqueWbsElementsWithProducts.keys()) {
    keys.push(key);
  }

  return (
    <>
      <Typography variant="h5">Products</Typography>
      <Table component={Paper}>
        <TableHead>
          <TableRow>
            <TableCell>WBS Element</TableCell>
            <TableCell>Products</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {keys.map((key) => {
            return (
              <TableRow key={key}>
                <TableCell>{key}</TableCell>
                <TableCell>
                  {uniqueWbsElementsWithProducts.get(key)?.map((product) => {
                    return <Chip label={`${product.name} $${product.cost}`} />;
                  })}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default ReimbursementProductsView;
