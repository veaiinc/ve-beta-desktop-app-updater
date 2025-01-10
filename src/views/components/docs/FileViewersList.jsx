import React, { memo, useCallback, useState, useEffect } from 'react';
import SessionActivityModal from '../activity/ActivitySessionModal.jsx';
import Spinner from '../loaders/Spinner.jsx';
import { formatTime } from './DocsActivity.jsx';

const FileViewersList = ({ loading, viewersList, fileData }) => {
	const [info, setInfo] = useState({
		loading: true,
		fileViewerList: null,
		viewerSessionData: null,
		showViewerSessionModal: false,
		selectedViewer: null,
	});

	useEffect(() => {
		setInfo((prev) => ({ ...prev, fileViewerList: viewersList }));
	}, [viewersList]);

	const handleSelectViewer = useCallback((viewer) => {
		setInfo((prev) => ({ ...prev, showViewerSessionModal: true, selectedViewer: viewer }));
	}, []);

	return (
		<>
			<div className="listViewContainer">
				{loading ? (
					// Fallback UI when viewersListData is empty or null
					[{}, {}, {}, {}, {}]?.map((ele, index) => (
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								alignSelf: 'stretch',
								backgroundColor: '#333232',
								height: '55px',
								borderRadius: '8px',
								fontWeight: 'bold',
							}}
							key={index}
						>
							<Spinner width={'20px'} height={'20px'} />
						</div>
					))
				) : info?.fileViewerList?.length === 0 || !info?.fileViewerList ? (
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							alignSelf: 'stretch',
							backgroundColor: '#262626',
							height: '55px',
							borderRadius: '8px',
							fontWeight: 'bold',
						}}
					>
						Data not available at the moment ...
					</div>
				) : (
					// Render the data when viewersListData is not empty or null
					info?.fileViewerList?.map((viewer, index) => (
						<div
							className="itemContainer"
							onClick={() => {
								handleSelectViewer(viewer);
							}}
							key={index}
						>
							<div className="viewerInfoContainer">
								{/* Avatar Section */}
								<div className="viewerAvatar">
									{/* <span>{viewer?.avatar}</span> */}
									{viewer?.isAnonymus ? (
										<span className="viewerName">A</span>
									) : (
										viewer?.name
											?.split(' ')
											.map((word) => word[0])
											.join('')
											.toUpperCase() || null
									)}
								</div>
								{/* Viewer Details */}
								<div className="viewerDetails">
									{viewer?.isAnonymus ? (
										<span className="viewerName">Anonymous</span>
									) : (
										<span className="viewerName">{viewer?.name}</span>
									)}
									{viewer.email && (
										<span className="viewerEmail">{viewer?.email}</span>
									)}
								</div>
							</div>
							<div className="viewerSessionsContainer">
								<div className="viewerSessionInfo">
									<div className="viewerSessions">
										{viewer?.sessionCount} Sessions
									</div>
									<div className="viewerTime">
										{viewer?.duration
											? formatTime(viewer?.duration)
											: '00:00:0'}
									</div>
								</div>
							</div>
						</div>
					))
				)}
			</div>

			<SessionActivityModal
				modalIsOpen={info?.showViewerSessionModal}
				showDrawer={() => {
					setInfo((prev) => ({ ...prev, showViewerSessionModal: false }));
				}}
				selectedViewer={info?.selectedViewer}
				formatTime={formatTime}
				workflowData={fileData}
			/>
		</>
	);
};

export default memo(FileViewersList);
