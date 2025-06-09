import { useState, useEffect, useContext, useCallback, memo, useMemo } from 'react';
import { ReactComponent as UploadSvg } from '../../../assets/svg/ai_agents/upload.svg';
import { Tooltip, Upload } from 'antd';
import { ReactComponent as SearchSvg } from '../../../assets/svg/workflow/search.svg';
import Context from '../../../context/context';

const UploadFileTooltip = ({
	children,
	handleChange,
	isUploadFileOpen,
	setIsUploadFileOpen,
	fileTypeIcons = {},
}) => {
	const [info, setInfo] = useState({});

	const handleConnect = () => {
		console.log('connect');
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
						<div className="chat-integrations-container">
							<div className="integration" onClick={handleConnect}>
								<div className="integration-icon">{fileTypeIcons?.gmail}</div>
								<div className="integration-title">Connect Gmail</div>
							</div>
						</div>
						<div className="horizontal-line" />
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
