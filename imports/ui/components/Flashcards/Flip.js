import React from 'react';
import './Flip.css';

const Flip = React.forwardRef((props, ref) => {
  return <div ref={ref} style={{height: props.height+'px'}} 
              className={`flip ${props.flipped ? 'flipped' : ''}`} >
    <div className="flip__content">
      <div className="flip__content--front">
        { typeof props.front === 'function' 
          ? props.front()
          : props.front
        }
      </div>

      <div className="flip__content--back">
        { typeof props.front === 'function' 
          ? props.back()
          : props.back
        }
      </div>
    </div>
  </div>
});

export {
  Flip
}