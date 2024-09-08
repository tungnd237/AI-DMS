import React from 'react';
import Modal from "react-modal";

const ModalWrapper = ({isOpen, children}) => {
    return <Modal isOpen={isOpen}
                  portalClassName={`topic-modal ${isOpen && 'fixed inset-0 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center'}`}
                  style={{
                      content: {
                          position: 'absolute',
                          top: '40px',
                          left: '40px',
                          right: '40px',
                          bottom: '40px',
                          border: '1px solid #ccc',
                          background: '#fff',
                          overflow: 'auto',
                          WebkitOverflowScrolling: 'touch',
                          borderRadius: '4px',
                          outline: 'none',
                          padding: '25px',
                      }
                  }}
    >
        <div className="flex flex-col h-full">
            {children}
        </div>
    </Modal>
};

export default ModalWrapper;