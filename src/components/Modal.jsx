import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }} onClick={onClose}>
      <div 
        className="glass-panel" 
        style={{ 
          width: '100%', 
          maxWidth: '500px', 
          maxHeight: '90vh', 
          overflowY: 'auto', 
          padding: '30px', 
          position: 'relative' 
        }} 
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          style={{ 
            position: 'absolute', 
            top: '20px', 
            right: '20px', 
            background: 'none', 
            border: 'none', 
            color: 'var(--text-secondary)', 
            cursor: 'pointer' 
          }}
        >
          <X size={24} />
        </button>
        
        <h2 style={{ marginBottom: '25px', fontSize: '1.5rem', fontWeight: 'bold' }}>{title}</h2>
        
        {children}
      </div>
    </div>
  );
};

export default Modal;
