type ToastProps = {
    message: string;
};

/** Transient confirmation pill, pinned bottom-center. Caller controls lifecycle. */
export const Toast = ({ message }: ToastProps) => (
    <div className="fixed bottom-7 left-1/2 z-[1080] max-w-[320px] -translate-x-1/2 animate-[toast-in_220ms_var(--ease-spring)] rounded-full bg-slate-900 px-[18px] py-2.5 text-center text-[13px] font-medium text-white shadow-lg">
        {message}
    </div>
);
