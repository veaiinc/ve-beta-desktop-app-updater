import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import HeaderComponent from './HeaderComponent';
import ActionDetailsBlock from './ActionDetailsBlock';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/googleActions.scss';
import Context from '../../../../context/context';
import { ReactComponent as FilledTick } from '../../../../assets/svg/worflow_builder/buildercard/filledTick.svg';
import EditAndViewEmailTemplateModal from '../../modalsV2/workflowBuilderModals/EditAndViewEmailTemplateModal';
import VariableComponent from './VariableComponent';
import HeadersDropDownComp from '../../dropDown/HeadersDropDownComp';
import { ReactComponent as Edit } from '../../../../assets/svg/worflow_builder/buildercard/edit.svg';
import {
	containerStyle,
	dropDownStyle,
	dropDownTextStyling,
	selectedValueStyling,
} from '../../../features/automation_builder/automationContentsHelper';
import { message } from 'antd';
import Spinner from '../../loaders/Spinner';
import validator from 'validator';
const GoogleActions = ({
	onBack,
	onSave,
	loading,
	selectedAction,
	activeStepsData,
	handleChangeClick,
}) => {
	const {
		templates: { allEmailTemplates },
		automationBuilder: { connectedIntegrations, variables },
	} = useContext(Context);
	const [info, setInfo] = useState({
		title: '',
		description: '',
		emailTemplateIsShown: false,
		emailTemplates: [],
		selectedEmailTemplate: '',
		previewAndEdit: false,
		googleAccountOptions: [],
		selectedGoogleAccount: null,
	});
	useEffect(() => {
		if (!activeStepsData) {
			setInfo((prevInfo) => ({
				...prevInfo,
				title: '',
				description: '',
			}));
		}
	}, [selectedAction]);

	useEffect(() => {
		if (allEmailTemplates) {
			setInfo((prev) => ({
				...prev,
				emailTemplates: allEmailTemplates?.data,
			}));
		}
	}, [allEmailTemplates]);

	useEffect(() => {
		if (connectedIntegrations?.google) {
			setInfo((prev) => ({
				...prev,
				googleAccountOptions: connectedIntegrations?.google?.map((account) => ({
					label: account?.email,
					value: account?.email,
				})),
				selectedGoogleAccount: {
					label: connectedIntegrations?.google?.[0]?.email,
					value: connectedIntegrations?.google?.[0]?.email,
				},
			}));
		}
	}, [connectedIntegrations]);

	useEffect(() => {
		if (activeStepsData) {
			setInfo((prev) => ({
				...prev,
				title: activeStepsData.title,
				description: activeStepsData.description,
				selectedGoogleAccount: {
					label: activeStepsData?.inputBody?.connectedEmail,
					value: activeStepsData?.inputBody?.connectedEmail,
				},
				selectedEmailTemplate: info?.emailTemplates?.find(
					(ele) => ele?._id === activeStepsData?.inputBody?.emailTemplateId,
				),
			}));
		}
	}, [activeStepsData, info?.emailTemplates]);

	const updateInfo = useCallback((data) => {
		setInfo((prevInfo) => ({ ...prevInfo, ...data }));
	}, []);

	const onChangeButtonClick = useCallback(() => {
		if (activeStepsData) {
			handleChangeClick(activeStepsData?.app);
		} else {
			onBack();
		}
	}, [handleChangeClick, activeStepsData, onBack]);

	const changeSubjectOrEmailBody = useCallback(
		(updatedData) => {
			setInfo((prev) => ({
				...prev,
				selectedEmailTemplate: {
					...prev.selectedEmailTemplate,
					subject: updatedData.subject,
					htmlBody: updatedData.emailBody,
				},
			}));
		},
		[info],
	);

	const modifiedOnSave = useCallback(
		(inputBody) => {
			const variableRegex = /^\{\{.*\}\}$/;
			const variables = {};
			if (!info?.title?.trim()?.length) {
				return message.error('Title is mandatory');
			}
			if (!info?.description?.trim()?.length) {
				return message.error('Description is mandatory');
			}

			for (const key in inputBody) {
				if (variableRegex.test(inputBody[key])) {
					variables[key] = [inputBody[key].slice(2, -2)];
				}
			}
			onSave({
				title: info?.title,
				description: info?.description,
				type: 'action',
				app: 'gmail',
				actionType: inputBody?.action,
				inputBody,
				...(Object.keys(variables)?.length ? { variables } : {}),
			});
		},
		[onSave, info?.title, info?.description],
	);

	const actionMapper = useMemo(() => {
		return {
			createDraft: (
				<CreateDraft
					selectedEmailTemplate={info?.selectedEmailTemplate}
					openTemplates={() => updateInfo({ emailTemplateIsShown: true })}
					googleAccountOptions={info?.googleAccountOptions}
					selectedGoogleAccount={info?.selectedGoogleAccount}
					changeGoogleAccount={(option) => updateInfo({ selectedGoogleAccount: option })}
					openPreviewAndEditModal={() => updateInfo({ previewAndEdit: true })}
					modifiedOnSave={modifiedOnSave}
					loading={loading}
					inputBody={activeStepsData?.inputBody || null}
				/>
			),
			getDraft: (
				<GetDraft
					selectedEmailTemplate={info?.selectedEmailTemplate}
					openTemplates={() => updateInfo({ emailTemplateIsShown: true })}
					variables={variables}
					googleAccountOptions={info?.googleAccountOptions}
					selectedGoogleAccount={info?.selectedGoogleAccount}
					changeGoogleAccount={(option) => updateInfo({ selectedGoogleAccount: option })}
					modifiedOnSave={modifiedOnSave}
					loading={loading}
					inputBody={activeStepsData?.inputBody || null}
				/>
			),
			deleteDraft: (
				<DeleteDraft
					variables={variables}
					googleAccountOptions={info?.googleAccountOptions}
					selectedGoogleAccount={info?.selectedGoogleAccount}
					changeGoogleAccount={(option) => updateInfo({ selectedGoogleAccount: option })}
					modifiedOnSave={modifiedOnSave}
					loading={loading}
					inputBody={activeStepsData?.inputBody || null}
				/>
			),
			getLabelInfo: (
				<GetLabelInfo
					variables={variables}
					googleAccountOptions={info?.googleAccountOptions}
					selectedGoogleAccount={info?.selectedGoogleAccount}
					changeGoogleAccount={(option) => updateInfo({ selectedGoogleAccount: option })}
					modifiedOnSave={modifiedOnSave}
					loading={loading}
					inputBody={activeStepsData?.inputBody || null}
				/>
			),
			replyMessage: (
				<ReplyMessage
					selectedEmailTemplate={info?.selectedEmailTemplate}
					openTemplates={() => updateInfo({ emailTemplateIsShown: true })}
					variables={variables}
					googleAccountOptions={info?.googleAccountOptions}
					selectedGoogleAccount={info?.selectedGoogleAccount}
					changeGoogleAccount={(option) => updateInfo({ selectedGoogleAccount: option })}
					modifiedOnSave={modifiedOnSave}
					loading={loading}
					inputBody={activeStepsData?.inputBody || null}
					openPreviewAndEditModal={() => updateInfo({ previewAndEdit: true })}
				/>
			),
			sendMessage: (
				<SendMessage
					selectedEmailTemplate={info?.selectedEmailTemplate}
					openTemplates={() => updateInfo({ emailTemplateIsShown: true })}
					googleAccountOptions={info?.googleAccountOptions}
					selectedGoogleAccount={info?.selectedGoogleAccount}
					changeGoogleAccount={(option) => updateInfo({ selectedGoogleAccount: option })}
					modifiedOnSave={modifiedOnSave}
					loading={loading}
					inputBody={activeStepsData?.inputBody || null}
					variables={variables}
					openPreviewAndEditModal={() => updateInfo({ previewAndEdit: true })}
				/>
			),
		};
	}, [
		selectedAction,
		info?.selectedEmailTemplate,
		variables,
		info?.googleAccountOptions,
		info?.selectedGoogleAccount,
		modifiedOnSave,
		loading,
		activeStepsData?.inputBody,
	]);

	return (
		<div className="googleActionsContainer">
			<HeaderComponent
				heading={
					info?.emailTemplateIsShown ? 'Email Templates' : selectedAction?.actionLabel
				}
				onBack={
					info?.emailTemplateIsShown
						? () => updateInfo({ emailTemplateIsShown: false })
						: onBack
				}
			/>

			<div
				className={`notificationEmailTemplatesContainer ${
					info?.emailTemplateIsShown ? 'active' : ''
				}`}
			>
				{info?.emailTemplates?.map((ele, index) => (
					<div
						className="emailTemplatesCard"
						key={index}
						style={{
							backgroundColor:
								ele?._id === info?.selectedEmailTemplate?._id ? '#202123' : '',
						}}
						onClick={() =>
							updateInfo({
								selectedEmailTemplate: ele,
								emailTemplateIsShown: false,
							})
						}
					>
						<div className="emailTemplateCardContent">
							<span className="emailTemplateTitle">{ele?.title}</span>
							<span className="emailTemplateSubjectStyling">{ele?.subject}</span>
						</div>

						{ele?._id === info?.selectedEmailTemplate?._id ? <FilledTick /> : ''}
					</div>
				))}
			</div>

			<ActionDetailsBlock
				title={info?.title}
				description={info?.description}
				updaterFn={updateInfo}
				onChangeButtonClick={onChangeButtonClick}
				actionLabel={selectedAction?.actionLabel}
			/>
			<div className="googleActionsContainerBody">
				{actionMapper?.[selectedAction?.actionType]}
			</div>

			<EditAndViewEmailTemplateModal
				open={info?.previewAndEdit}
				closeModal={() => updateInfo({ previewAndEdit: false })}
				subject={info?.selectedEmailTemplate?.subject}
				emailBody={info?.selectedEmailTemplate?.htmlBody}
				changeSubjectOrEmailBody={changeSubjectOrEmailBody}
			/>
		</div>
	);
};

export default memo(GoogleActions);

const CreateDraft = memo(
	({
		selectedEmailTemplate,
		openTemplates,
		googleAccountOptions,
		selectedGoogleAccount,
		changeGoogleAccount,
		openPreviewAndEditModal,
		modifiedOnSave,
		loading,
	}) => {
		const handleSave = useCallback(() => {
			if (!selectedEmailTemplate) {
				return message.error('Email template is mandatory');
			}
			if (!selectedGoogleAccount?.value?.trim()?.length) {
				return message.error('Google account is mandatory');
			}
			modifiedOnSave({
				action: 'createDraft',
				emailTemplateTitle: selectedEmailTemplate?.title,
				connectedEmail: selectedGoogleAccount?.value,
				htmlBody: selectedEmailTemplate?.htmlBody,
				emailTemplateSubject: selectedEmailTemplate?.subject,
				emailTemplateId: selectedEmailTemplate?._id,
			});
		}, [modifiedOnSave, selectedEmailTemplate, selectedGoogleAccount]);

		return (
			<>
				<h3 className="googleActionsContainerBodyItemHeader">Inputs</h3>
				<div className="googleActionsContainerBodyItem">
					<div className="inputWrapper">
						<span className="inputLabel">Google Account</span>
						<HeadersDropDownComp
							options={googleAccountOptions}
							selectedValue={selectedGoogleAccount?.label}
							onChangeFunc={(option) => changeGoogleAccount(option)}
							showIcon={false}
							containerStyle={{
								...containerStyle,
								background: '#1C1C1C',
								border: '1px solid #2C2D2E',
								borderRadius: '12px',
								height: '40px',
							}}
							outerContainerStyle={{ width: '100%' }}
							dropDownStyle={{
								...dropDownStyle,
								background: '#1C1C1C',
								border: '1px solid #2C2C2C',
							}}
							dropDownTextStyling={{
								...dropDownTextStyling,
								color: '#FFFFFF',
							}}
							showSelectedValueTick={true}
							uniqueIdentifierForTickIcon={'value'}
							selectedValueObj={selectedGoogleAccount}
							selectedValueStyle={{
								...selectedValueStyling,
								color: '#FFFFFF',
							}}
						/>
					</div>
					<div className="inputWrapper">
						<span className="inputLabel">Template</span>
						{!selectedEmailTemplate ? (
							<div className="chooseEmailTemplateButton" onClick={openTemplates}>
								Choose from Template
							</div>
						) : (
							<div className="editEmailTemplateContainer">
								<span className="emailTemplateSubTitle">Email Template</span>
								<div
									className="editSelectedTemplateOptions"
									onClick={openPreviewAndEditModal}
								>
									<span>{selectedEmailTemplate?.title}</span>
									<div className="editSelectedEmailOptionContainer">
										Email Template <Edit />
									</div>
								</div>
								<div className="emailTemplateActionContainer">
									<button className="sidebarButton" onClick={openTemplates}>
										Change
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
				<button className="actionsSaveButton" disabled={loading} onClick={handleSave}>
					{loading ? <Spinner /> : 'Save'}
				</button>
			</>
		);
	},
);

const GetDraft = memo(
	({
		variables,
		googleAccountOptions,
		selectedGoogleAccount,
		changeGoogleAccount,
		modifiedOnSave,
		loading,
		inputBody,
	}) => {
		const [info, setInfo] = useState({
			draftId: '',
		});

		useEffect(() => {
			if (inputBody) {
				handleStateChange({ draftId: inputBody?.draftId });
			}
		}, [inputBody]);

		const handleStateChange = useCallback((data) => {
			setInfo((prev) => ({ ...prev, ...data }));
		}, []);

		const handleSave = useCallback(() => {
			if (!info?.draftId?.trim()?.length) {
				return message.error('Draft id is mandatory');
			}
			if (!selectedGoogleAccount?.value?.trim()?.length) {
				return message.error('Google account is mandatory');
			}
			modifiedOnSave({
				action: 'getDraft',
				draftId: info?.draftId?.trim(),
				connectedEmail: selectedGoogleAccount?.value,
			});
		}, [modifiedOnSave, selectedGoogleAccount, info?.draftId]);

		return (
			<>
				<h3 className="googleActionsContainerBodyItemHeader">Inputs</h3>
				<div className="googleActionsContainerBodyItem">
					<div className="inputWrapper">
						<span className="inputLabel">Google Account</span>
						<HeadersDropDownComp
							options={googleAccountOptions}
							selectedValue={selectedGoogleAccount?.label}
							onChangeFunc={(option) => changeGoogleAccount(option)}
							showIcon={false}
							containerStyle={{
								...containerStyle,
								background: '#1C1C1C',
								border: '1px solid #2C2D2E',
								borderRadius: '12px',
								height: '40px',
							}}
							outerContainerStyle={{ width: '100%' }}
							dropDownStyle={{
								...dropDownStyle,
								background: '#1C1C1C',
								border: '1px solid #2C2C2C',
							}}
							dropDownTextStyling={{
								...dropDownTextStyling,
								color: '#FFFFFF',
							}}
							showSelectedValueTick={true}
							uniqueIdentifierForTickIcon={'value'}
							selectedValueObj={selectedGoogleAccount}
							selectedValueStyle={{
								...selectedValueStyling,
								color: '#FFFFFF',
							}}
						/>
					</div>
					<div className="inputWrapper">
						<span className="inputLabel">Draft id</span>
						<VariableComponent
							variables={variables?.data}
							value={info?.draftId}
							onChange={(value) => handleStateChange({ draftId: value })}
						/>
					</div>
				</div>
				<button className="actionsSaveButton" disabled={loading} onClick={handleSave}>
					{loading ? <Spinner /> : 'Save'}
				</button>
			</>
		);
	},
);

const DeleteDraft = memo(
	({
		variables,
		googleAccountOptions,
		selectedGoogleAccount,
		changeGoogleAccount,
		modifiedOnSave,
		loading,
		inputBody,
	}) => {
		const [info, setInfo] = useState({
			draftId: '',
		});

		useEffect(() => {
			if (inputBody) {
				handleStateChange({ draftId: inputBody?.draftId });
			}
		}, [inputBody]);

		const handleStateChange = useCallback((data) => {
			setInfo((prev) => ({ ...prev, ...data }));
		}, []);

		const handleSave = useCallback(() => {
			if (!info?.draftId?.trim()?.length) {
				return message.error('Draft id is mandatory');
			}
			if (!selectedGoogleAccount?.value?.trim()?.length) {
				return message.error('Google account is mandatory');
			}
			modifiedOnSave({
				action: 'deleteDraft',
				draftId: info?.draftId?.trim(),
				connectedEmail: selectedGoogleAccount?.value,
			});
		}, [modifiedOnSave, selectedGoogleAccount, info?.draftId]);

		return (
			<>
				<h3 className="googleActionsContainerBodyItemHeader">Inputs</h3>
				<div className="googleActionsContainerBodyItem">
					<div className="inputWrapper">
						<span className="inputLabel">Google Account</span>
						<HeadersDropDownComp
							options={googleAccountOptions}
							selectedValue={selectedGoogleAccount?.label}
							onChangeFunc={(option) => changeGoogleAccount(option)}
							showIcon={false}
							containerStyle={{
								...containerStyle,
								background: '#1C1C1C',
								border: '1px solid #2C2D2E',
								borderRadius: '12px',
								height: '40px',
							}}
							outerContainerStyle={{ width: '100%' }}
							dropDownStyle={{
								...dropDownStyle,
								background: '#1C1C1C',
								border: '1px solid #2C2C2C',
							}}
							dropDownTextStyling={{
								...dropDownTextStyling,
								color: '#FFFFFF',
							}}
							showSelectedValueTick={true}
							uniqueIdentifierForTickIcon={'value'}
							selectedValueObj={selectedGoogleAccount}
							selectedValueStyle={{
								...selectedValueStyling,
								color: '#FFFFFF',
							}}
						/>
					</div>
					<div className="inputWrapper">
						<span className="inputLabel">Draft id</span>
						<VariableComponent
							variables={variables?.data}
							value={info?.draftId}
							onChange={(value) => handleStateChange({ draftId: value })}
						/>
					</div>
				</div>
				<button className="actionsSaveButton" disabled={loading} onClick={handleSave}>
					{loading ? <Spinner /> : 'Save'}
				</button>
			</>
		);
	},
);

const GetLabelInfo = memo(
	({
		variables,
		googleAccountOptions,
		selectedGoogleAccount,
		changeGoogleAccount,
		modifiedOnSave,
		loading,
		inputBody,
	}) => {
		const [info, setInfo] = useState({
			labelId: '',
		});

		useEffect(() => {
			if (inputBody) {
				handleStateChange({ labelId: inputBody?.labelId });
			}
		}, [inputBody]);

		const handleStateChange = useCallback((data) => {
			setInfo((prev) => ({ ...prev, ...data }));
		}, []);

		const handleSave = useCallback(() => {
			if (!info?.labelId?.trim()?.length) {
				return message.error('Label id is mandatory');
			}
			if (!selectedGoogleAccount?.value?.trim()?.length) {
				return message.error('Google account is mandatory');
			}
			modifiedOnSave({
				action: 'getLabelInfo',
				connectedEmail: selectedGoogleAccount?.value,
				labelId: info?.labelId?.trim(),
			});
		}, [modifiedOnSave, selectedGoogleAccount, info?.labelId]);

		return (
			<>
				<h3 className="googleActionsContainerBodyItemHeader">Inputs</h3>
				<div className="googleActionsContainerBodyItem">
					<div className="inputWrapper">
						<span className="inputLabel">Google Account</span>
						<HeadersDropDownComp
							options={googleAccountOptions}
							selectedValue={selectedGoogleAccount?.label}
							onChangeFunc={(option) => changeGoogleAccount(option)}
							showIcon={false}
							containerStyle={{
								...containerStyle,
								background: '#1C1C1C',
								border: '1px solid #2C2D2E',
								borderRadius: '12px',
								height: '40px',
							}}
							outerContainerStyle={{ width: '100%' }}
							dropDownStyle={{
								...dropDownStyle,
								background: '#1C1C1C',
								border: '1px solid #2C2C2C',
							}}
							dropDownTextStyling={{
								...dropDownTextStyling,
								color: '#FFFFFF',
							}}
							showSelectedValueTick={true}
							uniqueIdentifierForTickIcon={'value'}
							selectedValueObj={selectedGoogleAccount}
							selectedValueStyle={{
								...selectedValueStyling,
								color: '#FFFFFF',
							}}
						/>
					</div>
					<div className="inputWrapper">
						<span className="inputLabel">Label id</span>
						<VariableComponent
							variables={variables?.data}
							value={info?.labelId}
							onChange={(value) => handleStateChange({ labelId: value })}
						/>
					</div>
				</div>
				<button className="actionsSaveButton" disabled={loading} onClick={handleSave}>
					{loading ? <Spinner /> : 'Save'}
				</button>
			</>
		);
	},
);

const ReplyMessage = memo(
	({
		selectedEmailTemplate,
		openTemplates,
		googleAccountOptions,
		selectedGoogleAccount,
		changeGoogleAccount,
		openPreviewAndEditModal,
		modifiedOnSave,
		loading,
		inputBody,
		variables,
	}) => {
		const [info, setInfo] = useState({
			messageId: '',
		});

		useEffect(() => {
			if (inputBody) {
				handleStateChange({ messageId: inputBody?.messageId });
			}
		}, [inputBody]);

		const handleStateChange = useCallback((data) => {
			setInfo((prev) => ({ ...prev, ...data }));
		}, []);

		const handleSave = useCallback(() => {
			if (!selectedEmailTemplate) {
				return message.error('Email template is mandatory');
			}
			if (!selectedGoogleAccount?.value?.trim()?.length) {
				return message.error('Google account is mandatory');
			}
			if (!info?.messageId?.trim()?.length) {
				return message.error('Message id is mandatory');
			}
			modifiedOnSave({
				action: 'replyMessage',
				emailTemplateTitle: selectedEmailTemplate?.title,
				connectedEmail: selectedGoogleAccount?.value,
				htmlBody: selectedEmailTemplate?.htmlBody,
				emailTemplateSubject: selectedEmailTemplate?.subject,
				emailTemplateId: selectedEmailTemplate?._id,
				messageId: info?.messageId?.trim(),
			});
		}, [modifiedOnSave, selectedEmailTemplate, selectedGoogleAccount, info?.messageId]);

		return (
			<>
				<h3 className="googleActionsContainerBodyItemHeader">Inputs</h3>
				<div className="googleActionsContainerBodyItem">
					<div className="inputWrapper">
						<span className="inputLabel">Google Account</span>
						<HeadersDropDownComp
							options={googleAccountOptions}
							selectedValue={selectedGoogleAccount?.label}
							onChangeFunc={(option) => changeGoogleAccount(option)}
							showIcon={false}
							containerStyle={{
								...containerStyle,
								background: '#1C1C1C',
								border: '1px solid #2C2D2E',
								borderRadius: '12px',
								height: '40px',
							}}
							outerContainerStyle={{ width: '100%' }}
							dropDownStyle={{
								...dropDownStyle,
								background: '#1C1C1C',
								border: '1px solid #2C2C2C',
							}}
							dropDownTextStyling={{
								...dropDownTextStyling,
								color: '#FFFFFF',
							}}
							showSelectedValueTick={true}
							uniqueIdentifierForTickIcon={'value'}
							selectedValueObj={selectedGoogleAccount}
							selectedValueStyle={{
								...selectedValueStyling,
								color: '#FFFFFF',
							}}
						/>
					</div>
					<div className="inputWrapper">
						<span className="inputLabel">Template</span>
						{!selectedEmailTemplate ? (
							<div className="chooseEmailTemplateButton" onClick={openTemplates}>
								Choose from Template
							</div>
						) : (
							<div className="editEmailTemplateContainer">
								<span className="emailTemplateSubTitle">Email Template</span>
								<div
									className="editSelectedTemplateOptions"
									onClick={openPreviewAndEditModal}
								>
									<span>{selectedEmailTemplate?.title}</span>
									<div className="editSelectedEmailOptionContainer">
										Email Template <Edit />
									</div>
								</div>
								<div className="emailTemplateActionContainer">
									<button className="sidebarButton" onClick={openTemplates}>
										Change
									</button>
								</div>
							</div>
						)}
					</div>
					<div className="inputWrapper">
						<span className="inputLabel">Message id</span>
						<VariableComponent
							variables={variables?.data}
							value={info?.messageId}
							onChange={(value) => handleStateChange({ messageId: value })}
						/>
					</div>
				</div>
				<button className="actionsSaveButton" disabled={loading} onClick={handleSave}>
					{loading ? <Spinner /> : 'Save'}
				</button>
			</>
		);
	},
);

const SendMessage = memo(
	({
		selectedEmailTemplate,
		openTemplates,
		googleAccountOptions,
		selectedGoogleAccount,
		changeGoogleAccount,
		openPreviewAndEditModal,
		modifiedOnSave,
		loading,
		inputBody,
		variables,
	}) => {
		const [info, setInfo] = useState({
			toEmail: '',
		});

		useEffect(() => {
			if (inputBody) {
				handleStateChange({ toEmail: inputBody?.toEmail });
			}
		}, [inputBody]);

		const handleStateChange = useCallback((data) => {
			setInfo((prev) => ({ ...prev, ...data }));
		}, []);

		const handleSave = useCallback(() => {
			const variableRegex = /^\{\{.*\}\}$/;
			if (!selectedEmailTemplate) {
				return message.error('Email template is mandatory');
			}
			if (!selectedGoogleAccount?.value?.trim()?.length) {
				return message.error('Google account is mandatory');
			}
			if (!info?.toEmail?.trim()?.length) {
				return message.error('Recipient email is mandatory');
			}
			if (!variableRegex.test(info?.toEmail) && !validator.isEmail(info?.toEmail)) {
				return message.error('Please enter a valid recipient email address');
			}
			modifiedOnSave({
				action: 'sendMessage',
				emailTemplateTitle: selectedEmailTemplate?.title,
				connectedEmail: selectedGoogleAccount?.value,
				htmlBody: selectedEmailTemplate?.htmlBody,
				emailTemplateSubject: selectedEmailTemplate?.subject,
				emailTemplateId: selectedEmailTemplate?._id,
				toEmail: info?.toEmail?.trim(),
			});
		}, [modifiedOnSave, selectedEmailTemplate, selectedGoogleAccount, info?.toEmail]);

		return (
			<>
				<h3 className="googleActionsContainerBodyItemHeader">Inputs</h3>
				<div className="googleActionsContainerBodyItem">
					<div className="inputWrapper">
						<span className="inputLabel">Google Account</span>
						<HeadersDropDownComp
							options={googleAccountOptions}
							selectedValue={selectedGoogleAccount?.label}
							onChangeFunc={(option) => changeGoogleAccount(option)}
							showIcon={false}
							containerStyle={{
								...containerStyle,
								background: '#1C1C1C',
								border: '1px solid #2C2D2E',
								borderRadius: '12px',
								height: '40px',
							}}
							outerContainerStyle={{ width: '100%' }}
							dropDownStyle={{
								...dropDownStyle,
								background: '#1C1C1C',
								border: '1px solid #2C2C2C',
							}}
							dropDownTextStyling={{
								...dropDownTextStyling,
								color: '#FFFFFF',
							}}
							showSelectedValueTick={true}
							uniqueIdentifierForTickIcon={'value'}
							selectedValueObj={selectedGoogleAccount}
							selectedValueStyle={{
								...selectedValueStyling,
								color: '#FFFFFF',
							}}
						/>
					</div>
					<div className="inputWrapper">
						<span className="inputLabel">Template</span>
						{!selectedEmailTemplate ? (
							<div className="chooseEmailTemplateButton" onClick={openTemplates}>
								Choose from Template
							</div>
						) : (
							<div className="editEmailTemplateContainer">
								<span className="emailTemplateSubTitle">Email Template</span>
								<div
									className="editSelectedTemplateOptions"
									onClick={openPreviewAndEditModal}
								>
									<span>{selectedEmailTemplate?.title}</span>
									<div className="editSelectedEmailOptionContainer">
										Email Template <Edit />
									</div>
								</div>
								<div className="emailTemplateActionContainer">
									<button className="sidebarButton" onClick={openTemplates}>
										Change
									</button>
								</div>
							</div>
						)}
					</div>
					<div className="inputWrapper">
						<span className="inputLabel">Recipient Email</span>
						<VariableComponent
							variables={variables?.data}
							value={info?.toEmail}
							onChange={(value) => handleStateChange({ toEmail: value })}
						/>
					</div>
				</div>
				<button className="actionsSaveButton" disabled={loading} onClick={handleSave}>
					{loading ? <Spinner /> : 'Save'}
				</button>
			</>
		);
	},
);
