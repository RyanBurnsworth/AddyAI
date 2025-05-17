import { useEffect } from "react";
import type SnackBarProps from "../../props/SnackBarProps";

export function SnackBar({ message, duration, show, onClose, color}: SnackBarProps) {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [show, duration, onClose]);

    return(
        <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg text-white transition-opacity duration-300 ${show ? `opacity-100 ${color}` : "opacity-0 pointer-events-none"}`}>
            {message}
        </div>
    )
}
