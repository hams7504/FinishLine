/*
 * This file is part of NER's FinishLine and licensed under GNU AGPLv3.
 * See the LICENSE file in the repository root folder for details.
 */
import { Control, Controller, FieldError } from 'react-hook-form';
import { TextField, InputAdornment, SxProps, Theme, SvgIconProps } from '@mui/material';

interface ReactHookTextFieldProps {
  name: string;
  control: Control<any, any>;
  rules?: Omit<any, any>;
  fullWidth?: boolean;
  label?: string;
  placeholder?: string;
  size?: 'small' | 'medium';
  sx?: SxProps<Theme>;
  type?: string;
  startAdornment?: SvgIconProps;
  multiline?: boolean;
  rows?: number;
  endAdornment?: React.ReactElement;
  errorMessage?: FieldError;
}

const ReactHookTextField: React.FC<ReactHookTextFieldProps> = ({
  name,
  control,
  rules,
  fullWidth,
  label,
  placeholder,
  size,
  sx,
  type,
  startAdornment,
  multiline,
  rows,
  endAdornment,
  errorMessage
}) => {
  const defaultRules = { required: true };

  let inputProps = {};
  if (type === 'number') {
    inputProps = { inputProps: { min: 0 } };
  }
  if (startAdornment) {
    inputProps = { ...inputProps, startAdornment: <InputAdornment position="start">{startAdornment}</InputAdornment> };
  }
  if (endAdornment) {
    inputProps = { ...inputProps, endAdornment };
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={rules || defaultRules}
      render={({ field: { onChange, value } }) => (
        <TextField
          required
          id={`${name}-input`}
          autoComplete="off"
          onChange={onChange}
          value={value}
          fullWidth={fullWidth}
          label={label}
          placeholder={placeholder}
          size={size}
          sx={sx}
          type={type}
          InputProps={inputProps}
          multiline={multiline}
          rows={rows}
          error={!!errorMessage}
          helperText={errorMessage?.message}
        />
      )}
    />
  );
};

export default ReactHookTextField;
