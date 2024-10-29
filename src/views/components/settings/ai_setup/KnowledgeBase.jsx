import React, { memo, useState, useContext, useEffect } from 'react';
import AddKnowledgeModal from '../../../components/modalsV2/settings/ai_setup/AddKnowledgeModal';
import '../../../../assets/scss/settings/aiSetupPage.scss';
import Context from '../../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from '../../loaders/Spinner';
import { ReactComponent as LinkIcon } from '../../../../assets/svg/Settings/link-white-color.svg';
import { ReactComponent as PdfIcon } from '../../../../assets/svg/Settings/pdf-icon.svg';
import { ReactComponent as TextIcon } from '../../../../assets/svg/Settings/text-icon.svg';
import Skeleton from 'react-loading-skeleton';
// import { ReactComponent as HollowCircleBlue } from '../../../../assets/svg/Settings/hollow-circle-blue.svg';
// import Template from './tempImg.png';

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
		aiSetup: { knowledgeBaseFiles, getKnowledgeBaseFiles },
	} = useContext(Context);

	const [info, setInfo] = useState({
		isAddKnowledgeModalOpen: false,
		areKnowledgeBaseFilesLoading: true,
		isKnowledgeBaseEmpty: false,
	});

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

	const fetchMoreKnowledgeBaseFiles = () => {
		const nextPageNumber = knowledgeBaseFiles?.currentPage + 1;
		getKnowledgeBaseFiles(nextPageNumber);
	};

	const toggleModal = () => {
		setInfo({ ...info, isAddKnowledgeModalOpen: !info?.isAddKnowledgeModalOpen });
	};

	useEffect(() => {
		console.log('knowledgeBaseFilesLoading', knowledgeBaseFiles?.areKnowledgeBaseFilesLoading);
	}, [knowledgeBaseFiles?.areKnowledgeBaseFilesLoading]);

	return (
		<div className="ai-knowledge-base-container">
			{/* <div className="assigning-ai">
				<div className="ai-header">
					<h1>Ve.ai is assisting to:</h1>
					<button>Assign</button>
				</div>
				<div className="line"></div>
				<div className="templates-container">
					<div className="template-preview">
						<img src={Template} alt="template" />
					</div>
					<div className="template-details">
						<h1 className="template-name">Wedding Photography Business Solution</h1>
						<ul>
							<li>
								<HollowCircleBlue />
								<span>Enquiry Form</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Proposal</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Contract</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Thank You</span>
							</li>
						</ul>
						<div className="default-knowledge-container">
							<p>Default Knowledge: </p>
							<div className="default-knowledge-link-container">
								<LinkWhite />
								<p>Smart File</p>
							</div>
						</div>
					</div>
					<div className="template-remove">Remove</div>
				</div>
				<div className="templates-container">
					<div className="template-preview">
						<img src={Template} alt="template" />
					</div>
					<div className="template-details">
						<h1 className="template-name">Wedding Photography Business Solution</h1>
						<ul>
							<li>
								<HollowCircleBlue />
								<span>Enquiry Form</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Proposal</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Contract</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Thank You</span>
							</li>
						</ul>
						<div className="default-knowledge-container">
							<p>Default Knowledge: </p>
							<div className="default-knowledge-link-container">
								<LinkWhite />
								<p>Smart File</p>
							</div>
						</div>
					</div>
					<div className="template-remove">Remove</div>
				</div>
				<div className="templates-container">
					<div className="template-preview">
						<img src={Template} alt="template" />
					</div>
					<div className="template-details">
						<h1 className="template-name">Wedding Photography Business Solution</h1>
						<ul>
							<li>
								<HollowCircleBlue />
								<span>Enquiry Form</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Proposal</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Contract</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Thank You</span>
							</li>
						</ul>
						<div className="default-knowledge-container">
							<p>Default Knowledge: </p>
							<div className="default-knowledge-link-container">
								<LinkWhite />
								<p>Smart File</p>
							</div>
						</div>
					</div>
					<div className="template-remove">Remove</div>
				</div>
				<div className="templates-container">
					<div className="template-preview">
						<img src={Template} alt="template" />
					</div>
					<div className="template-details">
						<h1 className="template-name">Wedding Photography Business Solution</h1>
						<ul>
							<li>
								<HollowCircleBlue />
								<span>Enquiry Form</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Proposal</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Contract</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Thank You</span>
							</li>
						</ul>
						<div className="default-knowledge-container">
							<p>Default Knowledge: </p>
							<div className="default-knowledge-link-container">
								<LinkWhite />
								<p>Smart File</p>
							</div>
						</div>
					</div>
					<div className="template-remove">Remove</div>
				</div>
				<div className="templates-container">
					<div className="template-preview">
						<img src={Template} alt="template" />
					</div>
					<div className="template-details">
						<h1 className="template-name">Wedding Photography Business Solution</h1>
						<ul>
							<li>
								<HollowCircleBlue />
								<span>Enquiry Form</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Proposal</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Contract</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Thank You</span>
							</li>
						</ul>
						<div className="default-knowledge-container">
							<p>Default Knowledge: </p>
							<div className="default-knowledge-link-container">
								<LinkWhite />
								<p>Smart File</p>
							</div>
						</div>
					</div>
					<div className="template-remove">Remove</div>
				</div>
				<div className="templates-container">
					<div className="template-preview">
						<img src={Template} alt="template" />
					</div>
					<div className="template-details">
						<h1 className="template-name">Wedding Photography Business Solution</h1>
						<ul>
							<li>
								<HollowCircleBlue />
								<span>Enquiry Form</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Proposal</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Contract</span>
							</li>
							<li>
								<HollowCircleBlue />
								<span>Thank You</span>
							</li>
						</ul>
						<div className="default-knowledge-container">
							<p>Default Knowledge: </p>
							<div className="default-knowledge-link-container">
								<LinkWhite />
								<p>Smart File</p>
							</div>
						</div>
					</div>
					<div className="template-remove">Remove</div>
				</div>
			</div> */}
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
		</div>
	);
};

export default memo(KnowledgeBase);
