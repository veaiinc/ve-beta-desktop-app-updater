import React, { memo, useState } from 'react';
import '../../../../assets/scss/ai_assistant/modal/actionsModal.scss';
import ReactModal from '../index';
import { ReactComponent as CloseSvg } from '../../../../assets/svg/close.svg';
import { ReactComponent as DeleteSvg } from '../../../../assets/svg/tasks/dustBin.svg';
import ActionButton from '../../ai_assistant/ActionButton';
import InputComponent from '../../ai_assistant/InputComponent';
import TextareaComponent from '../../ai_assistant/TextareaComponent';
import { ReactComponent as DownSvg } from '../../../../assets/svg/activity/down.svg';
import { Tooltip } from 'antd';
import { ReactComponent as TrashSvg } from '../../../../assets/svg/tasks/dustBin.svg';
import { ReactComponent as PlusSvg } from '../../../../assets/svg/tasks/plus.svg';

const methodsOptions = ['GET', 'POST', 'PUT', 'DELETE'];
const apiUsesOptions = ['JSON'];
const variableTypes = ['Text', 'Number', 'Float', 'Boolean'];

const ActionsModal = ({
	isOpen,
	onClose,
	onActionClick,
	showDelete,
	onDeleteClick,
	title,
	action,
	onTitleChange,
	onInstructionChange,
	isActionbtnLoading,
	isDeletebtnLoading,
}) => {
	const [info, setInfo] = useState({
		activeTab: 'endpoint', // endpoint, headers, body
		method: 'GET',
		apiUses: 'JSON',
		url: '',
		isMethodDropdownOpen: false,
		isApiUsesDropdownOpen: false,
		variables: [],
		openVariableTypeId: null,
	});

	const handleTabChange = (tab) => {
		setInfo((prevInfo) => ({ ...prevInfo, activeTab: tab }));
	};

	const updateInfo = (updateValue) => {
		setInfo((prevInfo) => ({ ...prevInfo, ...updateValue }));
	};

	const handleUrlChange = (e) => {
		updateInfo({ url: e.target.value });
	};

	const handleMethodChange = (method) => {
		updateInfo({ method, isMethodDropdownOpen: false });
	};

	const handleApiUsesChange = (apiUses) => {
		updateInfo({ apiUses, isApiUsesDropdownOpen: false });
	};

	const handleMethodDropdownVisibility = (visible) => {
		updateInfo({ isMethodDropdownOpen: visible });
	};

	const handleApiUsesDropdownVisibility = (visible) => {
		updateInfo({ isApiUsesDropdownOpen: visible });
	};

	const handleVariableTypeDropdownVisibility = (id, visible) => {
		updateInfo({ openVariableTypeId: visible ? id : null });
	};

	const handleVariableTypeChange = (id, type) => {
		const updatedVariables = info.variables.map((variable) =>
			variable.id === id ? { ...variable, type } : variable,
		);
		updateInfo({ variables: updatedVariables, openVariableTypeId: null });
	};

	const handleAddVariable = () => {
		const newVariable = {
			id: Date.now(),
			name: '',
			type: 'Text',
		};
		updateInfo({ variables: [...info.variables, newVariable] });
	};

	const handleVariableNameChange = (id, name) => {
		const updatedVariables = info.variables.map((variable) =>
			variable.id === id ? { ...variable, name } : variable,
		);
		updateInfo({ variables: updatedVariables });
	};

	const handleVariableDelete = (id) => {
		const updatedVariables = info.variables.filter((variable) => variable.id !== id);
		updateInfo({ variables: updatedVariables });
	};

	const tabs = {
		endpoint: {
			label: 'Endpoint',
			component: (
				<EndpointTab
					url={info.url}
					method={info.method}
					apiUses={info.apiUses}
					isMethodDropdownOpen={info.isMethodDropdownOpen}
					isApiUsesDropdownOpen={info.isApiUsesDropdownOpen}
					onUrlChange={handleUrlChange}
					onMethodChange={handleMethodChange}
					onApiUsesChange={handleApiUsesChange}
					onMethodDropdownVisibility={handleMethodDropdownVisibility}
					onApiUsesDropdownVisibility={handleApiUsesDropdownVisibility}
					variables={info.variables}
					openVariableTypeId={info.openVariableTypeId}
					onVariableTypeDropdownVisibility={handleVariableTypeDropdownVisibility}
					onVariableTypeChange={handleVariableTypeChange}
					onVariableNameChange={handleVariableNameChange}
					onVariableDelete={handleVariableDelete}
					onAddVariable={handleAddVariable}
				/>
			),
		},
		headers: { label: 'Headers', component: <MethodTab /> },
		body: { label: 'Body', component: <ApiUsesTab /> },
	};

	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={onClose}
			modalType={'center'}
			customStyles={{
				overlay: { zIndex: 1001 },
				content: { borderRadius: '15px', zIndex: 1002 },
			}}
		>
			<div className="actions-modal">
				<div className="actions-modal-header">
					<h2>Add Actions</h2>
					<CloseSvg onClick={onClose} />
				</div>
				<div className="actions-modal-inputs">
					<InputComponent placeholder="Title" value={title} onChange={onTitleChange} />

					<TextareaComponent
						placeholder="Add Instructions"
						value={action}
						onChange={onInstructionChange}
					/>
				</div>
				<div className="actions-modal-description">
					<h2>Connect to API</h2>
					<p>Build the API call for Action, including inputs from chats, variable.</p>
				</div>

				<div className="actionsTabContainer">
					<div className="actionTabs">
						{Object.keys(tabs)?.map((tab) => (
							<div
								key={tab}
								className={`actionTab ${info?.activeTab === tab ? 'active' : ''}`}
								onClick={() => handleTabChange(tab)}
							>
								{tabs?.[tab]?.label}
							</div>
						))}
					</div>
				</div>

				{tabs?.[info?.activeTab]?.component}

				<div className="actions-modal-footer">
					<div>
						{showDelete && (
							<div
								onClick={onDeleteClick ? onDeleteClick : onClose}
								className="actions-modal-footer-delete-button"
								disabled={isDeletebtnLoading}
							>
								<DeleteSvg />
							</div>
						)}
					</div>
					<ActionButton
						onClick={onActionClick ? onActionClick : onClose}
						disabled={
							title?.trim()?.length === 0 ||
							action?.trim()?.length === 0 ||
							isActionbtnLoading
						}
					>
						Add and make active
					</ActionButton>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(ActionsModal);

const EndpointTab = ({
	url,
	method,
	apiUses,
	isMethodDropdownOpen,
	isApiUsesDropdownOpen,
	onUrlChange,
	onMethodChange,
	onApiUsesChange,
	onMethodDropdownVisibility,
	onApiUsesDropdownVisibility,
	variables,
	openVariableTypeId,
	onVariableTypeDropdownVisibility,
	onVariableTypeChange,
	onVariableNameChange,
	onVariableDelete,
	onAddVariable,
}) => {
	return (
		<div className="endpointTabContainer">
			<div className="addUrlContainer">
				<input
					type="text"
					className="url"
					placeholder="Add URL"
					value={url}
					onChange={onUrlChange}
				/>
				<div className="urlMethodCotainer">
					<div className="method">
						<div className="method-label">Method</div>
						<Tooltip
							open={isMethodDropdownOpen}
							onOpenChange={onMethodDropdownVisibility}
							placement="bottom"
							title={
								<div className="actions-dropdown">
									{methodsOptions?.map((option) => (
										<div
											key={option}
											className="actions-dropdown-item"
											onClick={() => onMethodChange(option)}
										>
											{option}
										</div>
									))}
								</div>
							}
							arrow={false}
							trigger={'click'}
							color={'transparent'}
							overlayStyle={{ minWidth: 'fit-content', padding: '0' }}
						>
							<div className="method-dropdown">
								{method}
								<DownSvg className={`${isMethodDropdownOpen ? 'open' : ''}`} />
							</div>
						</Tooltip>
					</div>
					<div className="method">
						<div className="method-label">API body Type</div>
						<Tooltip
							open={isApiUsesDropdownOpen}
							onOpenChange={onApiUsesDropdownVisibility}
							placement="bottom"
							title={
								<div className="actions-dropdown">
									{apiUsesOptions?.map((option) => (
										<div
											key={option}
											className="actions-dropdown-item"
											onClick={() => onApiUsesChange(option)}
										>
											{option}
										</div>
									))}
								</div>
							}
							arrow={false}
							trigger={'click'}
							color={'transparent'}
							overlayStyle={{ minWidth: 'fit-content', padding: '0' }}
						>
							<div className="method-dropdown">
								{apiUses}
								<DownSvg className={`${isApiUsesDropdownOpen ? 'open' : ''}`} />
							</div>
						</Tooltip>
					</div>
				</div>
			</div>

			<div className="addVariablesContainer">
				<div className="header">
					<h2>Get inputs from chat</h2>
					<p>
						List any info your AI Agent needs to find in the conversation for this
						Action's API call.
					</p>
				</div>

				<div className="variablesContent">
					{variables.map((variable) => (
						<div key={variable.id} className="variableRow">
							<input
								type="text"
								className="variableInput"
								placeholder="Input"
								value={variable.name}
								onChange={(e) => onVariableNameChange(variable.id, e.target.value)}
							/>
							<div className="variableType">
								<Tooltip
									open={openVariableTypeId === variable.id}
									onOpenChange={(visible) =>
										onVariableTypeDropdownVisibility(variable.id, visible)
									}
									placement="bottomLeft"
									title={
										<div className="actions-dropdown">
											{variableTypes.map((type) => (
												<div
													key={type}
													className="actions-dropdown-item"
													onClick={() =>
														onVariableTypeChange(variable.id, type)
													}
												>
													{type}
												</div>
											))}
										</div>
									}
									arrow={false}
									trigger={'click'}
									color={'transparent'}
									overlayStyle={{
										minWidth: 'fit-content',
										padding: '0',
									}}
									overlayInnerStyle={{
										padding: 0,
										backgroundColor: 'transparent',
									}}
								>
									<div className="method-dropdown">
										{variable.type}
										<DownSvg
											className={`${
												openVariableTypeId === variable.id ? 'open' : ''
											}`}
										/>
									</div>
								</Tooltip>
							</div>
							<div
								className="deleteVariable"
								onClick={() => onVariableDelete(variable.id)}
							>
								<TrashSvg className="trash" />
							</div>
						</div>
					))}

					{variables.length === 0 && (
						<div className="emptyState">
							<p>No inputs added</p>
							<p>Add inputs to extract from chat</p>
						</div>
					)}

					<div className="addVariableButton" onClick={onAddVariable}>
						<PlusSvg />
						Add
					</div>
				</div>
			</div>
		</div>
	);
};

const MethodTab = () => {
	return <div>MethodTab</div>;
};

const ApiUsesTab = () => {
	return <div>ApiUsesTab</div>;
};
