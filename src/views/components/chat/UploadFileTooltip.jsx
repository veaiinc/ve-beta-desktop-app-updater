import { useState, useEffect, useContext, useCallback, memo, useMemo } from 'react';
import { ReactComponent as UploadSvg } from '../../../assets/svg/ai_agents/upload.svg';
import { Tooltip, Upload } from 'antd';
import Context from '../../../context/context';
import GmailSvg from '../../../assets/svg/login_page/GmailIcon';
import useWorkspaceMode from '../../../hooks/useWorkspaceMode';

const UploadFileTooltip = ({ children, handleChange, isUploadFileOpen, setIsUploadFileOpen }) => {
	const { workspaceMode } = useWorkspaceMode();
	const {
		templates: { connectThirdParty, connectedThirdParties, getConnectedThirdParties },
	} = useContext(Context);
	const connectedApps = connectedThirdParties?.data?.map((appInfo) => appInfo.app);
	const gmailConnected = connectedApps?.includes('gmail');

	useEffect(() => {
		if (isUploadFileOpen && !connectedThirdParties) {
			getConnectedThirdParties();
		}
	}, [isUploadFileOpen]);

	const handleConnect = async (connectType) => {
		connectThirdParty(connectType);
	};

	return (
		<div className="upload-file-wrapper">
			<Tooltip
				placement="bottom"
				open={isUploadFileOpen}
				onOpenChange={setIsUploadFileOpen}
				arrow={false}
				trigger={'click'}
				color={'transparent'}
				rootClassName="upload-file-tooltip-container"
				title={
					<div className="upload-file-container">
						{workspaceMode === 'beta' && (
							<>
								<div className="chat-integrations-container">
									<div
										className="integration"
										onClick={() => !gmailConnected && handleConnect('gmail')}
									>
										<div className="integration-icon">
											<GmailSvg width={18} height={16} />
										</div>
										<div className="integration-title">
											{gmailConnected ? `Connected Gmail` : `Connect Gmail`}
										</div>
									</div>
								</div>
								<div className="horizontal-line" />
							</>
						)}

						<div className="upload-file-wrapper">
							<Upload
								onChange={handleChange}
								showUploadList={false}
								beforeUpload={() => false} // Prevent default upload behavior
								maxCount={1} // Allow only one file at a time
								// accept="image/*" // Accept only images
								accept=".pdf,.docx,.txt,.md,.json,.png,.jpg,.jpeg,.csv,.xlsx,.xls"
							>
								<div className="upload-file-header">
									<UploadSvg />
									<div className="upload-file-text">Upload from Computer</div>
								</div>
							</Upload>
						</div>
					</div>
				}
			>
				{children}
			</Tooltip>
		</div>
	);
};

export default memo(UploadFileTooltip);
