export default interface DialogProps {
    show: boolean;

    onClose?: (isCancelled: boolean) => void;

    onError?: (error: string) => void;

    onSuccess?: () => void;
}
