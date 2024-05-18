import React from 'react';

interface ModalProps {
    show: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const PayModal: React.FC<ModalProps> = ({ show, onClose,  children }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-[rgba(0, 0, 0, 0.5)] flex items-center justify-center">
            <div className="bg-slate-900 rounded-md max-w-[450px] w-full p-5 shadow-[0 5px 15px rgba(0, 0, 0, 0.3)]">

                <div className="my-5 mx-0">
                    {children}
                </div>
                <div className="flex justify-end border-t-2 border-white pt-3 mb-[-6px]">
                    <button className='bg-red-600 rounded p-1 text-lg' onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default PayModal;
