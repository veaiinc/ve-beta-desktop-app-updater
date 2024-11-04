import React, { memo, useState, useContext, useEffect, useCallback } from 'react';
import AddKnowledgeModal from '../../../components/modalsV2/settings/ai_setup/AddKnowledgeModal';
import '../../../../assets/scss/settings/aiSetupPage.scss';
import Context from '../../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from '../../loaders/Spinner';
import { ReactComponent as LinkIcon } from '../../../../assets/svg/Settings/link-white-color.svg';
import { ReactComponent as PdfIcon } from '../../../../assets/svg/Settings/pdf-icon.svg';
import { ReactComponent as TextIcon } from '../../../../assets/svg/Settings/text-icon.svg';
import Skeleton from 'react-loading-skeleton';
import AssignAiAssistantModal from '../../../components/modalsV2/settings/ai_setup/AssignAiAssistantModal';
import Workflows from './Workflows';

const columnNames = ['Source', 'Status'];
const statuses = {
	notStarted: 'Not Started',
	processing: 'Training...',
	ready: 'Ready',
	error: 'Error',
};
const sourceTypes = {
	pdf: <PdfIcon />,
	url: <LinkIcon />,
	txt: <TextIcon />,
};

const KnowledgeBase = () => {
	let {
		aiSetup: { activeAiAssistantDetails, knowledgeBaseFiles, getKnowledgeBaseFiles },
		templates: { myWorkflows, getMyWorkflows },
	} = useContext(Context);

	const [info, setInfo] = useState({
		isAddKnowledgeModalOpen: false,
		areKnowledgeBaseFilesLoading: true,
		isKnowledgeBaseEmpty: false,
		isAssignAiAssistantModalOpen: false,
		workflows: null,
		selectedWorkflows: [],
	});

	useEffect(() => {
		getMyWorkflowTemplatesData(1);
	}, []);

	useEffect(() => {
		if (myWorkflows) {
			setInfo((prev) => ({ ...prev, workflows: myWorkflows?.data }));
		}
	}, [myWorkflows]);

	useEffect(() => {
		setInfo((prev) => ({
			...prev,
			areKnowledgeBaseFilesLoading: knowledgeBaseFiles?.areKnowledgeBaseFilesLoading,
		}));
		if (knowledgeBaseFiles?.data?.length === 0) {
			setInfo((prev) => ({ ...prev, isKnowledgeBaseEmpty: true }));
		} else {
			setInfo((prev) => ({ ...prev, isKnowledgeBaseEmpty: false }));
		}
	}, [knowledgeBaseFiles]);

	const getMyWorkflowTemplatesData = useCallback((page, fetchMore = false) => {
		const payload = {
			filters: {
				limit: 10,
				page: page,
				type: 'workspace',
				status: 'published',
				sortBy: 'createdAt',
				sortType: -1,
			},
		};
		getMyWorkflows(payload, fetchMore);
	}, []);

	const fetchMoreKnowledgeBaseFiles = () => {
		const nextPageNumber = knowledgeBaseFiles?.currentPage + 1;
		getKnowledgeBaseFiles(nextPageNumber);
	};

	const toggleModal = () => {
		setInfo({ ...info, isAddKnowledgeModalOpen: !info?.isAddKnowledgeModalOpen });
	};

	const toggleAssignAiAssistantModal = () => {
		setInfo({ ...info, isAssignAiAssistantModalOpen: !info?.isAssignAiAssistantModalOpen });
	};

	const handleOpenAssignAiAssistantModal = () => {
		toggleAssignAiAssistantModal();
	};

	useEffect(() => {
		console.log('knowledgeBaseFilesLoading', knowledgeBaseFiles?.areKnowledgeBaseFilesLoading);
	}, [knowledgeBaseFiles?.areKnowledgeBaseFilesLoading]);

	return (
		<div className="ai-knowledge-base-container">
			<div className="assigning-ai">
				<div className="ai-header">
					<h1>{activeAiAssistantDetails?.name} is assisting to:</h1>
					<button onClick={handleOpenAssignAiAssistantModal}>Assign</button>
				</div>
				<div className="line"></div>
				<Workflows info={info} />
			</div>
			<div className="active-knowledge-base">
				<div className="ai-header">
					<h1>Active Knowledges</h1>
					<button onClick={toggleModal}>Add Knowledge</button>
				</div>
				{knowledgeBaseFiles?.data?.length > 0 && (
					<ul className="column-titles-container">
						{columnNames?.map((columnName) => (
							<li key={columnName} className={columnName?.toLowerCase()}>
								{columnName}
							</li>
						))}
					</ul>
				)}
				<div className="knowledges-list" id="knowledges-list-target">
					{info?.areKnowledgeBaseFilesLoading ? (
						<Skeleton width={'100%'} height={'320px'} />
					) : (
						<InfiniteScroll
							className="knowledgebase-infinite-scroll"
							dataLength={knowledgeBaseFiles?.data?.length || 0}
							height={350}
							endMessage={
								knowledgeBaseFiles?.data?.length > 0 && (
									<p
										style={{
											textAlign: 'center',
											color: 'white',
											fontSize: '10px',
											padding: '4px',
										}}
									>
										End of knowledge files list!
									</p>
								)
							}
							scrollableTarget={'knowledges-list-target'}
							next={fetchMoreKnowledgeBaseFiles}
							hasMore={knowledgeBaseFiles?.hasMore}
							loader={
								<div
									style={{
										color: 'white',
										textAlign: 'center',
										fontSize: '10px',
										padding: '4px',
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										gap: '4px',
									}}
								>
									<span>Fetching More Files...</span>
									<Spinner width={'12px'} height={'12px'} />
								</div>
							}
						>
							{info?.isKnowledgeBaseEmpty ? (
								<p className="no-knowledge-files-found">
									No knowledge files found!
								</p>
							) : (
								knowledgeBaseFiles?.data?.map((knowledge) => (
									<div key={knowledge?._id} className="knowledge-item">
										<div className="knowledge-link-container">
											{sourceTypes?.[knowledge?.sourceType]}
											<p>{knowledge?.name}</p>
										</div>
										<div className="knowledge-status">
											<span className={`${knowledge?.status}`}>
												{knowledge?.status === 'processing' && (
													<div class="spinner-knowledge">
														<div className="inner-div"></div>
													</div>
												)}
												{statuses?.[knowledge?.status]}
											</span>
										</div>
									</div>
								))
							)}
						</InfiniteScroll>
					)}
				</div>
			</div>
			<AddKnowledgeModal isOpen={info?.isAddKnowledgeModalOpen} toggleModal={toggleModal} />
			<AssignAiAssistantModal
				isOpen={info?.isAssignAiAssistantModalOpen}
				toggleModal={toggleAssignAiAssistantModal}
				getMyWorkflowTemplatesData={getMyWorkflowTemplatesData}
				myWorkflows={myWorkflows}
				info={info}
				activeAiAssistantDetails={activeAiAssistantDetails}
			/>
		</div>
	);
};

export default memo(KnowledgeBase);
