import React, { memo, useCallback, useState } from 'react';
import HeadersDropDownComp from '../../dropDown/HeadersDropDownComp';
import {
	actionOptions,
	channelOptions,
	containerStyle,
	dropDownStyle,
	dropDownTextStyling,
	selectedValueStyling,
	takeActionsOptions,
} from '../../../features/workflow_builder/workflowContantsHelpers';
import ToggleSlider from '../../input/slider';
import { ReactComponent as DoubleArrow } from '../../../../assets/svg/worflow_builder/doubleArrow.svg';
import '../../../../assets/scss/workflowBuilder/workflowCardEditModal.scss';
const RenderActionUi = ({ closeModal, changeLocalOptionType, localOptionType }) => {
	const [info, setInfo] = useState({
		labelMapper: {
			notification: 'Send Notification',
			condition: 'Add Condition',
			pipeline: 'Move pipeline stage ',
			action: 'Actions',
		},
		valueObjectMapper: {
			notification: {
				label: 'Send notification',
				value: 'notification',
			},
			condition: {
				label: 'Condition',
				value: 'condition',
			},
			pipeline: {
				label: 'Move pipeline stage',
				value: 'pipeline',
			},
			action: {
				label: 'Actions',
				value: 'action',
			},
		},
	});

	const onOptionChangeFunc = useCallback(
		(data) => {
			if (data === localOptionType) {
				return;
			}
			changeLocalOptionType(data?.value);
		},
		[localOptionType],
	);

	return (
		<div className="actionContainer">
			{/* header */}
			<div className="workflowUpdatedHeader">
				<span onClick={closeModal}>
					<DoubleArrow />
				</span>

				<span className="headerTitle">Edit</span>
			</div>
			<div className="workflowOptionContainer">
				{/* //action */}
				<div className="actionDropDownContainer">
					<span className="actionTitle">Action</span>
					<HeadersDropDownComp
						options={actionOptions}
						selectedValue={info?.labelMapper?.[localOptionType]}
						onChangeFunc={(e) => onOptionChangeFunc(e)}
						showIcon={false}
						containerStyle={{
							...containerStyle,
						}}
						outerContainerStyle={{ width: '100%' }}
						dropDownStyle={{ ...dropDownStyle }}
						dropDownTextStyling={{ ...dropDownTextStyling }}
						showSelectedValueTick={true}
						uniqueIdentifierForTickIcon={'value'}
						selectedValueObj={info?.valueObjectMapper?.[localOptionType]}
						selectedValueStyle={{
							...selectedValueStyling,
						}}
					/>
				</div>
				<div className="workflow_builder_action_seperator"></div>
				{/* //action type */}
				<div className="actionDropDownContainer">
					<span className="actionTitle">Action Type</span>
					<HeadersDropDownComp
						options={takeActionsOptions}
						showIcon={false}
						containerStyle={{
							...containerStyle,
						}}
						outerContainerStyle={{ width: '100%' }}
						dropDownStyle={{ ...dropDownStyle }}
						dropDownTextStyling={{ ...dropDownTextStyling }}
						selectedValueStyle={{
							...selectedValueStyling,
						}}
					/>
				</div>
				<div className="workflow_builder_action_seperator"></div>
				{/* //notification type */}
				<div className="notification_schedulingContainer">
					<span className="actionTitle">When ?</span>
					<div className="notificationDaysContainer">
						{/* //incrementor */}
						<div className="incrementorDecrementorContainer">
							<div className="manualIncrementorButtons">-</div>
							<input className="manualIncrementorInput" />
							<div className="manualIncrementorButtons">+</div>
						</div>
						{/* //days */}
						<HeadersDropDownComp
							options={channelOptions}
							showIcon={false}
							containerStyle={{
								...containerStyle,
							}}
							outerContainerStyle={{ width: '100%' }}
							dropDownStyle={{ ...dropDownStyle }}
							dropDownTextStyling={{ ...dropDownTextStyling }}
							selectedValueStyle={{
								...selectedValueStyling,
							}}
						/>
					</div>
					<HeadersDropDownComp
						options={channelOptions}
						showIcon={false}
						containerStyle={{
							...containerStyle,
						}}
						outerContainerStyle={{ width: '100%' }}
						dropDownStyle={{ ...dropDownStyle }}
						dropDownTextStyling={{ ...dropDownTextStyling }}
						selectedValueStyle={{
							...selectedValueStyling,
						}}
					/>
				</div>
				{/* //required approval */}
				<div className="requiredApprovalContainer">
					<span className="requiredApprovalText">Require Approval before sending</span>
					<ToggleSlider />
				</div>
			</div>
			<div className="workflowFooterContainer">
				<div className="saveChangesButton">Save Changes</div>
			</div>
		</div>
	);
};
export default memo(RenderActionUi);
