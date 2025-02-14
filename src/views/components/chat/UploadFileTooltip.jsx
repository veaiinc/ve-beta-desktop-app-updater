import React, { useState } from 'react';
import { ReactComponent as UploadSvg } from '../../../assets/svg/ai_agents/upload.svg';
import { Tooltip, Upload } from 'antd';
import { ReactComponent as SearchSvg } from '../../../assets/svg/workflow/search.svg';
const UploadFileTooltip = ({ children, handleChange, isUploadFileOpen, setIsUploadFileOpen }) => {
	const [searchQuery, setSearchQuery] = useState('');
	return (
		<div className="upload-file-wrapper">
			<Tooltip
				placement="top"
				open={isUploadFileOpen}
				onOpenChange={setIsUploadFileOpen}
				arrow={false}
				trigger={'click'}
				color={'transparent'}
				title={
					<div className="upload-file-container">
						<div className="input-container">
							<SearchSvg />
							<input
								type="text"
								placeholder="Search by module"
								onChange={(e) => setSearchQuery(e?.target?.value)}
							/>
						</div>
						<div className="upload-file-wrapper">
							<div className="recent-files-wrapper">
								<div className="header">Recent</div>
								<div className="recent-files">
									<div className="recent-file">
										<div className="file-type-icon"></div>
										<div className="file-name">
											<div className="file-name-text"></div>
										</div>
									</div>
								</div>
							</div>
							<div className="horizontal-line"></div>
							<Upload
								onChange={handleChange}
								showUploadList={false}
								beforeUpload={() => false} // Prevent default upload behavior
								maxCount={1} // Allow only one file at a time
								// accept="image/*" // Accept only images
								accept=".pdf,.docx,.txt,.md,.json,.png,.jpg,.jpeg"
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

export default UploadFileTooltip;
