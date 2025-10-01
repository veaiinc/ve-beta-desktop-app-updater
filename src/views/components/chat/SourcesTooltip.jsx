import { memo } from 'react';
import s from '../../../assets/scss/chat/sourcesTooltip.module.scss';
import { Switch, Upload } from 'antd';
import { ReactComponent as UploadSvg } from '../../../assets/svg/chat/upload.svg';
import WebSvg from '../../../assets/svg/ai_agents/webSvg';
import BookSvg from '../../../assets/svg/ai_agents/bookSvg';
import { Tooltip } from 'antd';

const SourcesTooltip = ({
	handleFileAttachmentChange,
	handleSearchTypeChange,
	webSearchChecked,
	workspaceSearchChecked,
	children,
}) => {
	return (
		<Tooltip
			placement={'bottom'}
			color="transparent"
			trigger="click"
			arrow={false}
			rootClassName={s.sourcesTooltip}
			title={
				<div className={s.sourcesContainer}>
					<div className={s.uploadFileWrapper}>
						<Upload
							onChange={handleFileAttachmentChange}
							showUploadList={false}
							beforeUpload={() => false} // Prevent default upload behavior
							maxCount={1} // Allow only one file at a time
							// accept="image/*" // Accept only images
							accept=".pdf,.docx,.txt,.md,.json,.png,.jpg,.jpeg,.csv,.xlsx,.xls"
							rootClassName={s.uploadFileAntd}
						>
							<button className={s.uploadFileBtn}>
								<UploadSvg />
								<span className={s.btnText}>Upload file</span>
							</button>
						</Upload>
					</div>

					<div className={s.searchContainer}>
						<div className={s.leftContainer}>
							<div className={s.webSearchIcon}>
								<WebSvg />
							</div>
							<div className={s.textWrapper}>
								<div className={s.titleText}>Search web</div>
								<div className={s.subtitleText}>
									Search web for latest information
								</div>
							</div>
						</div>

						<div className={s.toggleButtonContainer}>
							<Switch
								checked={webSearchChecked}
								onChange={(checked) => {
									handleSearchTypeChange('webSearch', checked);
								}}
								size="small"
								style={{
									background: `${
										webSearchChecked
											? 'var(--primary-button)'
											: 'var(--stroke-hover)'
									}`,
								}}
							/>
						</div>
					</div>
					<div className={s.searchContainer}>
						<div className={s.leftContainer}>
							<div className={s.workspaceSearchIcon}>
								<BookSvg />
							</div>
							<div className={s.textWrapper}>
								<div className={s.titleText}>Internal Knowledge</div>
								<div className={s.subtitleText}>Search internal knowledge base</div>
							</div>
						</div>

						<div className={s.toggleButtonContainer}>
							<Switch
								checked={workspaceSearchChecked}
								onChange={(checked) => {
									handleSearchTypeChange('workspaceSearch', checked);
								}}
								size="small"
								style={{
									background: `${
										workspaceSearchChecked
											? 'var(--primary-button)'
											: 'var(--stroke-hover)'
									}`,
								}}
							/>
						</div>
					</div>
				</div>
			}
		>
			{children}
		</Tooltip>
	);
};

export default memo(SourcesTooltip);
