import React, { useState, useEffect, useContext, useCallback, memo } from 'react';
import { ReactComponent as UploadSvg } from '../../../assets/svg/ai_agents/upload.svg';
import { Tooltip, Upload } from 'antd';
import { ReactComponent as SearchSvg } from '../../../assets/svg/workflow/search.svg';
import Context from '../../../context/context';
import { FetchMoreLoaderComp } from '../../../helpers';
import InfiniteScroll from 'react-infinite-scroll-component';

let timeoutId = null;

const UploadFileTooltip = ({
	children,
	handleChange,
	isUploadFileOpen,
	setIsUploadFileOpen,
	handleRecentFileClick,
	fileTypeIcons = {},
}) => {
	const {
		aiSetup: { filesUploadedInAiChat, getFilesUploadedInAiChat },
	} = useContext(Context);
	const [info, setInfo] = useState({
		searchQuery: '',
		isSearchQueryChanged: false,
	});

	useEffect(() => {
		if (!filesUploadedInAiChat || info?.isSearchQueryChanged) {
			fetchFilesUploadedInAiChat(1);
			setInfo((prev) => ({ ...prev, isSearchQueryChanged: false }));
		}
	}, [info?.isSearchQueryChanged]);

	const fetchFilesUploadedInAiChat = async (page = 1) => {
		const payload = {
			limit: 5,
			page: page,
			originalFileName: info?.searchQuery,
		};
		getFilesUploadedInAiChat(payload, info?.isSearchQueryChanged);
	};

	const fetchMoreFilesUploadedInAiChat = async () => {
		fetchFilesUploadedInAiChat(filesUploadedInAiChat?.currentPage + 1);
	};

	const handleDebounceIsSearchQueryChanged = useCallback(() => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(() => {
			setInfo((prev) => ({ ...prev, isSearchQueryChanged: true }));
		}, 1000);
	}, []);

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
								onChange={(e) => {
									setInfo((prev) => ({
										...prev,
										searchQuery: e?.target?.value,
									}));
									handleDebounceIsSearchQueryChanged(e?.target?.value);
								}}
							/>
						</div>
						<div className="upload-file-wrapper">
							<div className="recent-files-wrapper">
								<div className="header">Recent</div>
								<div
									id="scrollableDiv"
									style={{
										height: '192px',
										overflow: 'auto',
										width: '100%',
									}}
								>
									<InfiniteScroll
										dataLength={filesUploadedInAiChat?.data?.length || 0}
										next={fetchMoreFilesUploadedInAiChat}
										hasMore={filesUploadedInAiChat?.hasNextPage}
										loader={<FetchMoreLoaderComp />}
										height={'192px'}
										scrollableTarget="scrollableDiv"
									>
										<div className="recent-files">
											{filesUploadedInAiChat?.data?.map((file) => {
												return (
													<div
														className="recent-file"
														onClick={() => handleRecentFileClick(file)}
														key={file?.id}
													>
														<div className="file-type-icon">
															{fileTypeIcons?.[file?.sourceType]}
														</div>
														<div className="file-name">
															{file?.originalFileName}
														</div>
													</div>
												);
											})}
										</div>
									</InfiniteScroll>
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

export default memo(UploadFileTooltip);
