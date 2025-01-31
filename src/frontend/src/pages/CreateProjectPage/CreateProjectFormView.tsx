/*
 * This file is part of NER's FinishLine and licensed under GNU AGPLv3.
 * See the LICENSE file in the repository root folder for details.
 */

import Box from '@mui/material/Box';
import PageBlock from '../../layouts/PageBlock';
import Grid from '@mui/material/Grid';
import { routes } from '../../utils/routes';
import { FormControl, FormLabel, MenuItem, TextField } from '@mui/material';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CreateProjectFormInputs } from './CreateProjectForm';
import ReactHookTextField from '../../components/ReactHookTextField';
import { useQuery } from '../../hooks/utils.hooks';
import { useAllTeams } from '../../hooks/teams.hooks';
import LoadingIndicator from '../../components/LoadingIndicator';
import NERFailButton from '../../components/NERFailButton';
import NERSuccessButton from '../../components/NERSuccessButton';
import { MouseEventHandler } from 'react';
import PageLayout from '../../components/PageLayout';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  carNumber: yup
    .number()
    .typeError('Car Number must be a number')
    .required('Car Number is required')
    .integer('Car Number must be an integer')
    .min(1, 'Car Number must be greater than or equal to 1'),
  crId: yup
    .number()
    .typeError('CR ID must be a number')
    .required('CR ID is required')
    .integer('CR ID must be an integer')
    .min(1, 'CR ID must be greater than or equal to 1'),
  summary: yup.string().required('Summary is required'),
  teamId: yup.string().required('Team is required')
});

interface CreateProjectFormViewProps {
  allowSubmit: boolean;
  onCancel: MouseEventHandler;
  onSubmit: (project: CreateProjectFormInputs) => void;
}

const CreateProjectFormView: React.FC<CreateProjectFormViewProps> = ({ allowSubmit, onCancel, onSubmit }) => {
  const query = useQuery();
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      carNumber: Number(query.get('wbs')?.charAt(0)),
      crId: Number(query.get('crId')),
      summary: '',
      teamId: ''
    }
  });

  const { isLoading, data: teams } = useAllTeams();
  if (isLoading || !teams) return <LoadingIndicator />;

  return (
    <PageLayout title="New Project" previousPages={[{ name: 'Projects', route: routes.PROJECTS }]}>
      <form
        id={'create-project-form'}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSubmit(onSubmit)(e);
        }}
        onKeyPress={(e) => {
          e.key === 'Enter' && e.preventDefault();
        }}
      >
        <PageBlock title={''}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <FormControl fullWidth>
                <FormLabel>Change Request ID</FormLabel>
                <ReactHookTextField
                  name="crId"
                  control={control}
                  placeholder="Enter change request ID..."
                  errorMessage={errors.crId}
                  type="number"
                />
              </FormControl>
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControl fullWidth>
                <FormLabel>Car Number</FormLabel>
                <ReactHookTextField
                  name="carNumber"
                  control={control}
                  placeholder="Enter car number..."
                  errorMessage={errors.carNumber}
                  type="number"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <FormLabel>Team</FormLabel>
                <Controller
                  name="teamId"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <TextField select onChange={onChange} value={value}>
                      {teams.map((t) => (
                        <MenuItem key={t.teamName} value={t.teamId}>
                          {t.teamName}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12}>
              <FormControl fullWidth>
                <FormLabel>Project Name</FormLabel>
                <ReactHookTextField
                  name="name"
                  control={control}
                  placeholder="Enter project name..."
                  errorMessage={errors.name}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12}>
              <FormControl fullWidth>
                <FormLabel>Project Summary</FormLabel>
                <ReactHookTextField
                  name="summary"
                  control={control}
                  placeholder="Enter summary..."
                  errorMessage={errors.summary}
                  multiline
                  rows={5}
                />
              </FormControl>
            </Grid>
          </Grid>
          <Box justifyContent="flex-end" display="flex" sx={{ mt: 2 }}>
            <NERFailButton variant="contained" onClick={onCancel} sx={{ mx: 1 }}>
              Cancel
            </NERFailButton>
            <NERSuccessButton variant="contained" type="submit" disabled={!allowSubmit} sx={{ mx: 1 }}>
              Create
            </NERSuccessButton>
          </Box>
        </PageBlock>
      </form>
    </PageLayout>
  );
};

export default CreateProjectFormView;
