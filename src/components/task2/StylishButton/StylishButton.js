import React from 'react';

import './StylishButton.scss';

export default function StylishButton({ children }) {

  return (
    <div className='stylish-button'>
      {children}
    </div>
  );
}