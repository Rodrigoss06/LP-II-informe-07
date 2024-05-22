import React from 'react';

interface ModalProps {
    show: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const UserCartModal: React.FC<ModalProps> = ({ show, onClose,  children }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-[rgba(0, 0, 0, 0.5)] flex items-center justify-center">
            <div className="bg-slate-900 rounded-md max-w-[450px] w-full px-5 pb-5 pt-1 shadow-[0 5px 15px rgba(0, 0, 0, 0.3)]">

                <div className="my-5 mx-0">
                    {children}
                </div>
                <div className="flex justify-center border-t-2 border-white pt-3 mb-[-6px]">
                    <button className='bg-red-600 rounded py-1 px-2 text-lg hover:bg-red-500' onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default UserCartModal;
