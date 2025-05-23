export default interface DialogProps {
    show: boolean;

    onClose: (isCancelled: boolean) => void;
}
