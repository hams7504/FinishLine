import { ReactNode } from 'react';
import { FieldValues, UseFormHandleSubmit, UseFormReset } from 'react-hook-form';
import NERModal, { NERModalProps } from './NERModal';

interface NERFormModalProps<T extends FieldValues> extends NERModalProps {
  reset: UseFormReset<T>;
  handleUseFormSubmit: UseFormHandleSubmit<T, undefined>;
  onFormSubmit: (data: T) => void;
  children?: ReactNode;
}

const NERFormModal = ({
  open,
  onHide,
  formId,
  title,
  reset,
  handleUseFormSubmit,
  onFormSubmit,
  cancelText,
  submitText,
  disabled,
  children,
  showCloseButton
}: NERFormModalProps<any>) => {
  /**
   * Wrapper function for onSubmit so that form data is reset after submit
   */
  const onSubmitWrapper = async (data: any) => {
    await onFormSubmit(data);
    reset({ confirmDone: false });
  };

  return (
    <NERModal
      open={open}
      onHide={onHide}
      formId={formId}
      title={title}
      cancelText={cancelText ? cancelText : 'Cancel'}
      submitText={submitText ? submitText : 'Submit'}
      disabled={disabled}
      showCloseButton={showCloseButton}
    >
      <form id={formId} onSubmit={handleUseFormSubmit(onSubmitWrapper)}>
        {children}
      </form>
    </NERModal>
  );
};

export default NERFormModal;
