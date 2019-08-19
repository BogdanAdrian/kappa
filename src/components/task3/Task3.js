import React from 'react';
import LoadingIndicator from './LoadingIndicator';

import './Task3.scss';

export default function Task3() {
  return (
    <div className='task-3'>
      <LoadingIndicator/>
      <div className='limitations'>
        <p> - if you zoom in enough, you can see small trails of colors which shouldn't be there. That's because part of the technique I used for displaying only quaters of circles was to overlap another circle with the color of the background color. This is a browser bug, because those trails shouldn't be there;</p>
        <p> - if you give it a small size, some colors will disappear because the size of the inner circles will become 0;</p>
        <p> - didn't know how to make the perpendicular strips on the quater of circles;</p>
        <p> - if you change the background you won't have the same experience (see point 1). For this, there is a solution - providing the background color as prop to the cmp.</p>
      </div>
    </div>
  );
}