import { memo, useContext, useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { FetchMoreLoaderComp } from '../../../helpers';
import '../../../assets/scss/chat/chatbox.scss';
import Context from '../../../context/context';
import { ReactComponent as SearchSvg } from '../../../assets/svg/workflow/search.svg';
import { ReactComponent as TickSvg } from '../../../assets/svg/home_page/Tick.svg';
import InfiniteScroll from '../globalComponents/InfiniteScroll';
import { Tooltip } from 'antd';
import Spinner from '../loaders/Spinner';

const RecentFileTooltip = ({
	children,
	isRecentFileOpen = true,
	handleRecentFileClick,
	fileTypeIcons = {},
	recentFiles = [],
	setIsRecentFileOpen,
}) => {
	const {
		aiSetup: { filesUploadedInAiChat, getFilesUploadedInAiChat },
	} = useContext(Context);

	const timeoutIdRef = useRef(null);

	const [info, setInfo] = useState({
		searchQuery: '',
		isSearchQueryChanged: false,
		loading: true,
	});

	useEffect(() => {
		if (isRecentFileOpen && (!filesUploadedInAiChat || info?.isSearchQueryChanged)) {
			fetchFilesUploadedInAiChat(1);
			setInfo((prev) => ({ ...prev, isSearchQueryChanged: false }));
		}
	}, [info?.isSearchQueryChanged, isRecentFileOpen]);

	useEffect(() => {
		if (filesUploadedInAiChat) {
			setInfo((prev) => ({ ...prev, loading: false }));
		}
	}, [filesUploadedInAiChat]);

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
		if (timeoutIdRef.current) {
			clearTimeout(timeoutIdRef.current);
		}
		timeoutIdRef.current = setTimeout(() => {
			setInfo((prev) => ({ ...prev, isSearchQueryChanged: true }));
		}, 1000);
	}, []);

	const selectedRecentFiles = useMemo(() => {
		return recentFiles?.map((file) => file?._id);
	}, [recentFiles]);
	return (
		<Tooltip
			placement="bottom"
			open={isRecentFileOpen}
			onOpenChange={setIsRecentFileOpen}
			arrow={false}
			trigger={'click'}
			color={'transparent'}
			rootClassName="recent-file-tooltip-container"
			title={
				<div className="recent-file-container">
					<div className="input-container">
						<SearchSvg />
						<input
							type="text"
							placeholder="Search"
							onChange={(e) => {
								setInfo((prev) => ({
									...prev,
									searchQuery: e?.target?.value,
								}));
								handleDebounceIsSearchQueryChanged(e?.target?.value);
							}}
						/>
					</div>
					<div className="recent-files-wrapper">
						<div className="header">Recent</div>
						{info?.loading ? (
							<div className="recent-file-loader">loading...</div>
						) : (
							<div
								id="scrollableDiv"
								style={{
									overflow: 'auto',
									width: '100%',
								}}
							>
								<InfiniteScroll
									dataLength={filesUploadedInAiChat?.data?.length || 0}
									next={fetchMoreFilesUploadedInAiChat}
									hasMore={filesUploadedInAiChat?.hasNextPage || false}
									loader={<FetchMoreLoaderComp />}
									height={'260px'}
									scrollableTarget="scrollableDiv"
								>
									<div className="recent-files">
										{filesUploadedInAiChat?.data?.map((file) => {
											return (
												<div
													className={`recent-file ${
														selectedRecentFiles?.includes(file?._id)
															? 'selected'
															: ''
													}`}
													onClick={() => handleRecentFileClick(file)}
													key={file?._id}
												>
													<div className="file-type-icon">
														{fileTypeIcons?.[file?.sourceType]}
													</div>
													<div className="file-name">
														{file?.originalFileName}
													</div>
													{selectedRecentFiles?.includes(file?._id) && (
														<div className="selected-icon">
															<TickSvg />
														</div>
													)}
												</div>
											);
										})}
									</div>
								</InfiniteScroll>
							</div>
						)}
					</div>
				</div>
			}
		>
			{children}
		</Tooltip>
	);
};

export default memo(RecentFileTooltip);
