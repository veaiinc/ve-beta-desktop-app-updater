import React from 'react';
import '../../../assets/scss/modules/proposals.scss';
import { ReactComponent as LeftArrow } from '../../../assets/svg/left-arrow.svg';
import InputForModules from '../../components/input/inputForModules';
import ToggleSlider from '../../components/input/slider';

function ProposalCRUD(props) {
    const handleInputChange = (e) => {
        let { name, value } = e.target;
        console.log(name, value);
    };

    const handleToggleChange = (newValue) => {
        console.log('Toggle value:', newValue);
        // Handle any further actions based on the toggle state
    };

    return (
        <div className="proposalsContainer">
            <div className="header">
                <div className="titleAndBackButton">
                    <LeftArrow /> <p>Create New Proposals</p>
                </div>
                <div className="sendProposalButton">
                    <p>Send Proposal</p>
                </div>
            </div>
            <div className="divider"></div>
            <div className="propsosEditContainer">
                <div className="previewContainer">
                    <p className="heading">Proposal Preview</p>
                    <div></div>
                </div>
                <div className="editContainer">
                    <p className="heading">Proposal Details</p>
                    <ToggleSlider onChange={handleToggleChange} />
                    <InputForModules
                        label={'Client Name'}
                        type={'text'}
                        placeholder={'Enter client name'}
                        name={''}
                        value={''}
                        onChange={handleInputChange}
                        isError={false}
                        errorMessage={''}
                    />

                    <InputForModules
                        label={'Client Email Address'}
                        type={'email'}
                        placeholder={'Enter you emailID'}
                        name={''}
                        value={''}
                        onChange={handleInputChange}
                        isError={false}
                        errorMessage={''}
                        prefixText={'$'}
                    />

                    <InputForModules
                        label={'Client Email Address'}
                        type={'textArea'}
                        placeholder={'Enter you emailID'}
                        name={''}
                        value={''}
                        onChange={handleInputChange}
                        isError={false}
                        errorMessage={''}
                    />

                    <InputForModules
                        label={'Client Email Address'}
                        type={'phoneNumber'}
                        placeholder={'Enter you emailID'}
                        name={''}
                        value={''}
                        onChange={handleInputChange}
                        isError={false}
                        errorMessage={''}
                    />

                    <InputForModules
                        label={'Client Email Address'}
                        type={'datePicker'}
                        placeholder={'Enter you emailID'}
                        name={''}
                        value={''}
                        onChange={handleInputChange}
                        isError={false}
                        errorMessage={''}
                        prefixText={true}
                    />

                    <InputForModules
                        label={'Client Email Address'}
                        type={'numbers-with-increment-large'}
                        placeholder={'Enter you emailID'}
                        name={''}
                        value={''}
                        onChange={handleInputChange}
                        isError={false}
                        errorMessage={''}
                        prefixText={true}
                    />

                    <InputForModules
                        label={'Client Email Address'}
                        type={'numbers-with-increment-small'}
                        placeholder={'Enter you emailID'}
                        name={''}
                        value={''}
                        onChange={handleInputChange}
                        isError={false}
                        errorMessage={''}
                        prefixText={true}
                    />
                </div>
            </div>
        </div>
    );
}

export default ProposalCRUD;
