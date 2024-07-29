import React, { memo, useMemo, useRef, useState } from 'react';
import ReactModal from '../../modalsV2/index';
import '../../../../assets/scss/workflowBuilder/workflowCardEditModal.scss';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import { ReactComponent as Dustbin } from '../../../../assets/svg/worflow_builder/dustbin.svg';
import { ReactComponent as EditSvg } from '../../../../assets/svg/worflow_builder/edit.svg';
import HeadersDropDownComp from '../../dropDown/HeadersDropDownComp';
import JoditEditor from 'jodit-react';
const options = [
	{
		label: 'Minutes',
		value: 'minutes',
		onClickFunc: () => {},
	},

	{
		label: 'Hours',
		value: 'hours',
		onClickFunc: () => {},
	},
	{
		label: 'Days',
		value: 'days',
		onClickFunc: () => {},
	},
	{
		label: 'Weeks',
		value: 'week',
		onClickFunc: () => {},
	},
];

const smartFileActions = [
	{
		label: 'After Form response is submitted',
		value: 'After Form response is submitted',
		onClickFunc: () => {},
	},

	{
		label: 'After Smart file is sent for un Accepted Proposals',
		value: 'After Smart file is sent for un Accepted Proposals',
		onClickFunc: () => {},
	},
	{
		label: 'After Proposal accepted',
		value: 'After Proposal accepted',
		onClickFunc: () => {},
	},
	{
		label: 'After Proposal accepted, Unsigned Contract',
		value: 'After Proposal accepted, Unsigned Contract',
		onClickFunc: () => {},
	},
	{
		label: 'After Form response is submitted',
		value: 'After Form response is submitted',
		onClickFunc: () => {},
	},

	{
		label: 'After Smart file is sent for un Accepted Proposals',
		value: 'After Smart file is sent for un Accepted Proposals',
		onClickFunc: () => {},
	},
	{
		label: 'After Proposal accepted',
		value: 'After Proposal accepted',
		onClickFunc: () => {},
	},
	{
		label: 'After Proposal accepted, Unsigned Contract',
		value: 'After Proposal accepted, Unsigned Contract',
		onClickFunc: () => {},
	},
];

const WorkflowCardEditModal = ({ modalIsOpen, closeModalFunc }) => {
	const editor = useRef(null);
	const [info, setInfo] = useState({
		editState: false,
	});
	const [content, setContent] = useState('');

	return (
		<ReactModal isOpen={modalIsOpen} closeModal={closeModalFunc} modalType="right">
			<div className="WorkflowCardEditModalParentContainer">
				<div className="innerContainer">
					{/* header */}
					<div className="workflowHeader">
						<span className="headerTitle">
							{info?.editState ? 'Edit Email' : `Edit Action`}
						</span>
						<div className="closeDeleteContainer">
							{!info?.editState ? (
								<>
									<span className="closeBtn">
										<Dustbin />
									</span>
									<div className="deleteBtn">Delete</div>
								</>
							) : (
								''
							)}
							<div className="closeBtn" onClick={closeModalFunc}>
								<Close />
							</div>
						</div>
					</div>
					{!info?.editState ? (
						<div className="WorkFlowEditorBody">
							{/* action typ */}
							<div className="actionType">
								<span className="actionTypeTitle">Action Type</span>
								<div className="actiondropDown"> Send Email</div>
							</div>
							{/* email template */}
							<div className="emailTemplate">
								<div className="emailTemplateHeader">
									<span className="emailTemplateNameStyling">
										Subject Line Here
									</span>
									<div
										className="editBtnContainer"
										onClick={() =>
											setInfo((prev) => ({ ...prev, editState: true }))
										}
									>
										<span className="EditBtn">Edit</span>
										<EditSvg />
									</div>
								</div>
								<div className="subjectInputDiv">dfgdfg</div>
							</div>
							<div
								className="emailTemplate"
								style={{
									paddingBottom: '20px',
									borderBottom: '1px solid rgba(40, 39, 40, 0.48)',
								}}
							>
								<div className="emailTemplateHeader">
									<span className="emailTemplateNameStyling">
										Email Body Here
									</span>
								</div>
								<textarea className="emailBody" disabled={true}>
									sdfdf
								</textarea>
							</div>
							<div className="emailScheduleTimingContainer">
								<span className="emailScheduleTimingContainerheader">When?</span>
								<div className="buttonContainer">
									<div className="daysIncrementor">
										<span className="incrementorButtons">-</span>
										<input type="number" className="daysIncrementText" />
										<span className="incrementorButtons">+</span>
									</div>
									<HeadersDropDownComp
										showIcon={false}
										options={options}
										containerStyle={{
											padding: '12px 24px',
											height: '48px',
											padding: '12px 24px',
											color: '#e4e5e6',
											width: 'inherit',
											flex: 1,
											alignSelf: 'stretch',
											borderRadius: '0.625rem',
											border: '1px solid rgba(36, 36, 36, 0.64)',
											backgroundColor: '#151515',
										}}
										dropDownStyle={{
											right: 0,
											top: '-170px',
											maxHeight: '300px',
										}}
									/>
								</div>
								<HeadersDropDownComp
									showIcon={false}
									options={smartFileActions}
									containerStyle={{
										padding: '12px 24px',
										height: '48px',
										padding: '12px 24px',
										color: '#e4e5e6',
										width: 'inherit',
										flex: 1,
										alignSelf: 'stretch',
										borderRadius: '0.625rem',
										border: '1px solid rgba(36, 36, 36, 0.64)',
										backgroundColor: '#151515',
									}}
									dropDownStyle={{
										right: 0,
										top: '-295px',
										maxHeight: '300px',
									}}
								/>
							</div>
							<div className="approvalContainer">
								<span className="approvalContainerHeader">
									Require Approval before sending
								</span>
							</div>
						</div>
					) : (
						<div className="editEmailContainer">
							<div className="editEmailSubject">
								<span className="emailSubjectHeader">Subject Line Here</span>
								<textarea className="subjectTextArea" />
							</div>
							<JoditEditor
								ref={editor}
								value={content}
								tabIndex={1} // tabIndex of textarea
								onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
								onChange={(newContent) => setContent(newContent)}
							/>
						</div>
					)}

					{/* footer */}
					<div className="workflowEditorFooter">
						<div className="saveBtn">Save Changes</div>
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(WorkflowCardEditModal);
