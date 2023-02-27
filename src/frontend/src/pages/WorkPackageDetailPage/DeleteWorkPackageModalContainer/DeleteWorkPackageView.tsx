/*
 * This file is part of NER's FinishLine and licensed under GNU AGPLv3.
 * See the LICENSE file in the repository root folder for details.
 */

import { validateWBS, WbsNumber, wbsPipe } from 'shared';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  IconButton,
  Typography
} from '@mui/material';
import { useForm } from 'react-hook-form';
import NERSuccessButton from '../../../components/NERSuccessButton';
import NERFailButton from '../../../components/NERFailButton';
import ReactHookTextField from '../../../components/ReactHookTextField';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CloseIcon from '@mui/icons-material/Close';
import { DeleteWorkPackageInputs } from './DeleteWorkPackage';

interface DeleteWorkPackageViewProps {
  wbsNum: WbsNumber;
  modalShow: boolean;
  onHide: () => void;
  onSubmit: (data: DeleteWorkPackageInputs) => Promise<void>;
}

const DeleteWorkPackageView: React.FC<DeleteWorkPackageViewProps> = ({ wbsNum, modalShow, onHide, onSubmit }) => {
  //   console.log(wbsPipe(wbsNum));
  //   const workPackageWbsTester = (wbsNum: string | undefined) => wbsNum !== undefined && wbsNum === wbsPipe(workPackage);
  const workPackageWbsTester = (wbsNum: string | undefined) => true;

  const schema = yup.object().shape({
    wbsNum: yup.string().required().test('wp-wbs-test', 'Work Package WBS Number does not match', workPackageWbsTester)
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isValid }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      wbsNum: ''
    },
    mode: 'onChange'
  });

  const onSubmitWrapper = async (data: DeleteWorkPackageInputs) => {
    await onSubmit(data);
  };

  return (
    <Dialog open={modalShow} onClose={onHide}>
      <DialogTitle
        className="font-weight-bold"
        sx={{
          '&.MuiDialogTitle-root': {
            padding: '1rem 1.5rem 0'
          }
        }}
      >{`Delete Work Package #${wbsPipe(wbsNum)}`}</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onHide}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500]
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent
        sx={{
          '&.MuiDialogContent-root': {
            padding: '1rem 1.5rem'
          }
        }}
      >
        <Typography sx={{ marginBottom: '1rem' }}>
          Are you sure you want to delete Work Package #{wbsPipe(wbsNum)}?
        </Typography>
        <Typography sx={{ fontWeight: 'bold' }}>This action cannot be undone!</Typography>
        <form
          id="delete-wp-form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit(onSubmitWrapper)(e);
          }}
        >
          <FormControl>
            <FormLabel sx={{ marginTop: '1rem', marginBottom: '1rem' }}>
              To confirm deletion, please type in the WBS number of this Work Package.
            </FormLabel>
            <ReactHookTextField
              control={control}
              name="wpWBS"
              errorMessage={errors.wbsNum}
              placeholder="Enter Work Package WBS # here"
              sx={{ width: 1 }}
            />
          </FormControl>
        </form>
      </DialogContent>
      <DialogActions>
        <NERSuccessButton variant="contained" sx={{ mx: 1 }} onClick={onHide}>
          Cancel
        </NERSuccessButton>
        <NERFailButton variant="contained" type="submit" form="delete-wp-form" sx={{ mx: 1 }} disabled={!isValid}>
          Delete
        </NERFailButton>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteWorkPackageView;
