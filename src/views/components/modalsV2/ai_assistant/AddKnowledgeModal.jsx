import ReactModal from '../index';
import { ReactComponent as CloseSvg } from '../../../../assets/svg/close.svg';
import { ReactComponent as TIcon } from '../../../../assets/svg/ai_assistant/tIcon.svg';
import { ReactComponent as URLIcon } from '../../../../assets/svg/ai_assistant/url.svg';
import { ReactComponent as FolderIcon } from '../../../../assets/svg/ai_assistant/folder.svg';
import ActionButton from '../../ai_assistant/ActionButton';
import '../../../../assets/scss/ai_assistant/modal/addKnowledgeModal.scss';
import { useState } from 'react';
import InputComponent from '../../ai_assistant/InputComponent';
const tabOptions = [
	{ label: 'URL', Icon: URLIcon },
	{ label: 'File', Icon: FolderIcon },
	{ label: 'Custom Text', Icon: TIcon },
];
const AddKnowledgeModal = ({ isOpen, onClose, onActionClick, isActionbtnLoading }) => {
	const [info, setInfo] = useState({
		activeTab: 'URL',
	});

	const updateInfo = (updatedInfo) => {
		setInfo((prev) => ({ ...prev, ...updatedInfo }));
	};
	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={onClose}
			modalType={'center'}
			customStyles={{ content: { borderRadius: '15px' } }}
		>
			<div className="add-knowledge-modal">
				<div className="add-knowledge-modal-header">
					<h2>Add Knowledge</h2>
					<CloseSvg onClick={onClose} />
				</div>
				<div className="add-knowledge-modal-body">
					<div className="knowledge-tab-header">
						<span className="knowledge-tab-header-title">
							Choose one of the following:
						</span>
						<div className="knowledge-tabs-wrapper">
							{tabOptions.map((tab) => (
								<div
									className={`knowledge-tab ${
										info?.activeTab === tab?.label ? 'active-tab' : ''
									}`}
									onClick={() => updateInfo({ activeTab: tab?.label })}
								>
									<div className="knowledge-tab-icon">
										{tab.Icon && <tab.Icon />}
									</div>
									<div className="knowledge-tab-label">{tab?.label}</div>
								</div>
							))}
						</div>
					</div>
					<div className="knowledge-tab-content">
						{info?.activeTab === 'URL' && (
							<div className="knowledge-tab-content-url">
								<div className="add-url-wrapper">
									<div className="input-wrapper">
										<InputComponent
											placeholder="Enter URL"
											value={info?.url}
											onChange={(e) => updateInfo({ url: e.target.value })}
										/>
									</div>
									<button className="btn-ghost">Add Link</button>
								</div>
								<div className="added-urls-wrapper">
									<div className="link-item">
										<div className="icon">
											<URLIcon />
										</div>
										<div className="link-item-info">
											<div className="link-item-title">
												https://www.google.com
											</div>
										</div>
										<div className="status-div"></div>
									</div>
								</div>
							</div>
						)}
						{info?.activeTab === 'File' && <div>File</div>}
						{info?.activeTab === 'Custom Text' && <div>Custom Text</div>}
					</div>
				</div>
				<div className="add-knowledge-modal-footer">
					<button className="btn-ghost">Cancel</button>
					<ActionButton
						onClick={onActionClick ? onActionClick : onClose}
						disabled={isActionbtnLoading}
					>
						Update
					</ActionButton>
				</div>
			</div>
		</ReactModal>
	);
};

export default AddKnowledgeModal;
