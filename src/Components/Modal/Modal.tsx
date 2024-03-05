import {ReactNode} from "react";

interface Props {
    children: ReactNode
    openModal: boolean
    setOpenModal: () => void
}

function Modal({children, openModal, setOpenModal}: Props) {
    return (
        <>
            {openModal &&
                <>
                    <div
                        className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
                    >
                        <div

                            className="relative z-10"
                            aria-labelledby="modal-title"
                            role="dialog"
                            aria-modal="true"
                        >

                            <div
                                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            ></div>

                            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">


                                <div
                                    className="relative p-2 min-h-[200px] transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
                                >
                                    <div className="flex justify-end items-center">
                                        <span onClick={setOpenModal}>Close</span>
                                    </div>


                                    {children}

                                </div>
                            </div>
                        </div>
                    </div>

                </>
            }
        </>
    );
}

export default Modal;