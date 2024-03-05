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
                        onClick={setOpenModal}
                        className="fixed z-10 inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    ></div>


                    <div className="min-w-[500px] min-h-[200px] rounded-lg z-10 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-12 w-12
                    bg-slate-900">
                        {children}
                    </div>

                </>
            }
        </>
    );
}

export default Modal;