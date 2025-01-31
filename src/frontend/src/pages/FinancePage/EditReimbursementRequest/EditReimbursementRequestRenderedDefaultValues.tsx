import { ReimbursementRequest } from 'shared';
import ReimbursementRequestForm, {
  ReimbursementRequestDataSubmission
} from '../ReimbursementRequestForm/ReimbursementRequestForm';
import PageLayout from '../../../components/PageLayout';
import { routes } from '../../../utils/routes';
import { fullNamePipe } from '../../../utils/pipes';

const EditReimbursementRequestRenderedDefaultValues: React.FC<{
  reimbursementRequest: ReimbursementRequest;
  onSubmitData: (data: ReimbursementRequestDataSubmission) => Promise<string>;
}> = ({ reimbursementRequest, onSubmitData }) => {
  const previousPage = `${routes.REIMBURSEMENT_REQUESTS}/${reimbursementRequest.reimbursementRequestId}`;

  return (
    <PageLayout
      title="Edit Reimbursement Request"
      previousPages={[
        {
          name: 'Finance',
          route: routes.FINANCE
        },
        {
          name: `${fullNamePipe(reimbursementRequest.recipient)}'s Reimbursement Request`,
          route: previousPage
        }
      ]}
    >
      <ReimbursementRequestForm
        submitText="Save"
        submitData={onSubmitData}
        defaultValues={{
          vendorId: reimbursementRequest.vendor.vendorId,
          account: reimbursementRequest.account,
          dateOfExpense: new Date(reimbursementRequest.dateOfExpense),
          expenseTypeId: reimbursementRequest.expenseType.expenseTypeId,
          reimbursementProducts: reimbursementRequest.reimbursementProducts.map((product) => ({
            wbsNum: product.wbsNum,
            name: product.name,
            cost: product.cost
          })),
          receiptFiles: reimbursementRequest.receiptPictures.map((receipt, index) => ({
            name: receipt.name,
            googleFileId: receipt.googleFileId
          }))
        }}
        previousPage={previousPage}
      />
    </PageLayout>
  );
};

export default EditReimbursementRequestRenderedDefaultValues;
