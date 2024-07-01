// ToggleSwitch.js
import React from 'react';
import './toggle.scss';

const ToggleSwitch = ({ isToggleOn, handleClick }) => {
    return (
        <div onClick={handleClick} className={'toggleSwitch'}>
            <div className={`${'knob'} ${isToggleOn ? 'active' : ''}`} />
        </div>
    );
};

export default ToggleSwitch;
