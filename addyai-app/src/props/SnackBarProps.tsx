export default interface SnackBarProps {
    message: string;

    duration: number;

    show: boolean;

    color: string;
    
    onClose: () => void;
}
