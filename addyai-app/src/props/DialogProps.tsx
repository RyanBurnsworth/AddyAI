export default interface DialogProps {
  show: boolean;

  headling?: string;
  
  message?: string;

  confirmText?: string;

  cancelText?: string;

  onClose?: (isCancelled: boolean) => void;

  onError?: (error: string) => void;

  onSuccess?: (amount?: number) => void;
}
