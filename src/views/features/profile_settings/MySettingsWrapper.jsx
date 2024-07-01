import React, { useState } from 'react';
import MySettingsPageLayout from './MySettingsPageLayout';
import MySettingsContainer from './MySettingsContainer';

const MySettingsWrapper = (props) => {
    return (
        <div className="mainContainer2">
            <MySettingsContainer />
            <MySettingsPageLayout />
        </div>
    );
};

export default MySettingsWrapper;
