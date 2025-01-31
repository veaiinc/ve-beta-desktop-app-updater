import React, { memo, useState } from 'react';
import ReactModal from '../index';
import { ReactComponent as CloseSvg } from '../../../../assets/svg/close.svg';
import { ReactComponent as DeleteSvg } from '../../../../assets/svg/tasks/dustBin.svg';
import '../../../../assets/scss/ai_assistant/modal/actionsModal.scss';
import ActionButton from '../../ai_assistant/ActionButton';
import InputComponent from '../../ai_assistant/InputComponent';
import TextareaComponent from '../../ai_assistant/TextareaComponent';
import { ReactComponent as DownSvg } from '../../../../assets/svg/activity/down.svg';
import { Tooltip } from 'antd';

const methodsOptions = ['GET', 'POST', 'PUT', 'DELETE'];
const apiUsesOptions = ['JSON'];

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
		activeTab: 'endpoint',
		method: 'GET',
		apiUses: 'JSON',
	});

	const updateInfo = (updateValue) => {
		setInfo((prevInfo) => ({ ...prevInfo, ...updateValue }));
	};

	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={onClose}
			modalType={'center'}
			customStyles={{ content: { borderRadius: '15px' } }}
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

				<div className="actions-modal-tabs">
					<div className="actions-modal-tabs-header">
						<span
							className={`actions-modal-tabs-header-item ${
								info?.activeTab === 'endpoint' ? 'active' : ''
							}`}
							onClick={() => updateInfo({ activeTab: 'endpoint' })}
						>
							Endpoint
						</span>
						<span
							className={`actions-modal-tabs-header-item ${
								info?.activeTab === 'headers' ? 'active' : ''
							}`}
							onClick={() => updateInfo({ activeTab: 'headers' })}
						>
							Headers
						</span>
					</div>
					<div className="actions-modal-tabs-body">
						<InputComponent
							placeholder="Add URL"
							value={info?.endpoint}
							onChange={() => {}}
						/>
						<div className="actions-modal-tabs-body-dropdown-wrapper">
							<div className="actions-modal-dropdown">
								<span className="actions-modal-dropdown-label">Method</span>
								<Tooltip
									placement="bottom"
									title={
										<div className="actions-dropdown">
											{methodsOptions?.map((option) => (
												<div
													className="actions-dropdown-item"
													onClick={() => updateInfo({ method: option })}
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
									<div className="actions-dropdown-selected">
										{info?.method}{' '}
										<DownSvg
											className={`${info?.isSelectVoiceOpen ? 'open' : ''}`}
										/>
									</div>
								</Tooltip>
							</div>
							<div className="actions-modal-dropdown">
								<span className="actions-modal-dropdown-label">This API uses</span>
								<Tooltip
									placement="bottom"
									title={
										<div className="actions-dropdown">
											{apiUsesOptions?.map((option) => (
												<div
													className="actions-dropdown-item"
													onClick={() => updateInfo({ apiUses: option })}
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
									<div className="actions-dropdown-selected">
										{info?.apiUses}{' '}
										<DownSvg
											className={`${info?.isSelectVoiceOpen ? 'open' : ''}`}
										/>
									</div>
								</Tooltip>
							</div>
						</div>
					</div>
				</div>
				<div className="actions-modal-footer">
					<div>
						{showDelete && (
							<button
								onClick={onDeleteClick ? onDeleteClick : onClose}
								className="actions-modal-footer-delete-button"
								disabled={isDeletebtnLoading}
							>
								<DeleteSvg />
							</button>
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
