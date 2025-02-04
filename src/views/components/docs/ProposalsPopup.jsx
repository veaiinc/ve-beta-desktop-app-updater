import React, { memo, useCallback, useContext, useEffect, useState, useRef } from 'react';
import Skeleton from 'react-loading-skeleton';
import InfiniteScroll from 'react-infinite-scroll-component';
import ReactModal from '../modalsV2';
import { ReactComponent as CrossSvg } from '../../../assets/svg/gallery/cross.svg';
import { ReactComponent as SearchIcon } from '../../../assets/svg/workflow/search.svg';
import '../../../assets/scss/docs/proposalsPopup.scss';
import { fetchOriginSelection } from '../../../helpers';
import Context from '../../../context/context';
import moment from 'moment';
const origin = fetchOriginSelection();

const options = ['All', 'Proposal', 'Invoice', 'Contract', 'Thank you'];

const initialState = {
	search: '',
	selectedOption: 'All',
	loading: true,
	workflowTemplates: [],
	hasNextPage: false,
	currentPage: 1,
	loading: false,
	timeout: null,
	searchChanged: false,
};

const ProposalPopup = ({ open, closeModal }) => {
	const customStyles = {
		content: { zIndex: 99999 },
		overlay: { zIndex: 99998 },
	};
	const [info, setInfo] = useState({
		...initialState,
	});

	const {
		templates: { getMyWorkflows, myWorkflows, myMoreWorkflows },
		activityInfo: { createSmartfile, smartfile },
	} = useContext(Context);

	useEffect(() => {
		getMyWorkflowsTemplatesData(1);
	}, []);

	useEffect(() => {
		if (myWorkflows) {
			myWorkflowsDataParser(myWorkflows);
		}
	}, [myWorkflows]);

	useEffect(() => {
		if (myMoreWorkflows) {
			myWorkflowsDataParser(myMoreWorkflows, true);
		}
	}, [myMoreWorkflows]);

	useEffect(() => {
		if (smartfile?._id) {
			window.location.href = `${origin}/${smartfile?._id}?workflow=true&templateId=${info?.activeTemaplateData?._id}`;
		}
	}, [smartfile]);

	useEffect(() => {
		if (info?.searchChanged) {
			handleDebounceFetch();
		}
	}, [info.search, info.searchChanged]);

	const handleDebounceFetch = useCallback(() => {
		clearInterval(info?.timeout);
		const timeout = setTimeout(() => {
			getMyWorkflowsTemplatesData(1, info.search);
			setInfo((prev) => ({
				...prev,
				timeout: null,
			}));
		}, 800);
		setInfo((prev) => ({ ...prev, timeout }));
	}, [info]);

	const handleTemplateClick = async (template) => {
		if (info?.loading) return;

		setInfo((prev) => ({ ...prev, loading: true, activeTemaplateData: template }));

		const payload = {
			smartFileInput: {
				templateId: template?._id,
				title: template?.title,
			},
		};

		try {
			await createSmartfile(payload);
		} catch (error) {
			console.error('Failed to create smartfile:', error);
		} finally {
			setInfo((prev) => ({ ...prev, loading: false }));
		}
	};

	const getMyWorkflowsTemplatesData = useCallback((page, search = null, fetchMore = false) => {
		const payload = {
			filters: {
				limit: 9,
				page: page,
				type: 'workspace',
				status: 'published',
				sortBy: 'createdAt',
				sortType: -1,
			},
		};
		if (search) {
			payload.filters.title = search;
		}
		getMyWorkflows(payload, fetchMore);
	}, []);

	const fetchMoreMyWorkflows = useCallback(() => {
		getMyWorkflowsTemplatesData(info?.currentPage + 1, info?.search, true);
	}, [info?.hasNextPage, info?.currentPage, info?.search]);

	const myWorkflowsDataParser = useCallback(
		(dataToBeUsed, fetchMore = false) => {
			let { data, currentPage, hasNextPage } = dataToBeUsed;
			let workflowTemplates = [];

			for (let i = 0; i < data?.length; i++) {
				if (
					data?.[i]?.tenantId &&
					data?.[i]?.tenantId !== null &&
					data?.[i]?.status === 'published'
				) {
					workflowTemplates?.push(data?.[i]);
				}
			}
			if (fetchMore) {
				workflowTemplates = [...(info?.workflowTemplates || [])]?.concat(workflowTemplates);
			}
			setInfo((prev) => ({
				...prev,
				loading: false,
				workflowTemplates,
				currentPage,
				hasNextPage,
			}));
		},
		[info?.workflowTemplates],
	);

	const handleSearchChange = (e) => {
		const value = e.target.value;
		setInfo((prev) => ({ ...prev, search: value, searchChanged: true }));
	};

	return (
		<ReactModal
			isOpen={open}
			closeModal={closeModal}
			modalType={'center'}
			customStyles={customStyles}
		>
			<div className="proposal-popup-container">
				<div className="proposal-popup-header">
					<div className="proposal-popup-header-text">Choose Template</div>
					<CrossSvg onClick={closeModal} style={{ cursor: 'pointer' }} />
				</div>
				<div className="proposal-popup-body">
					<div className="proposal-popup-search-div">
						<div className="proposal-popup-search-div-input-container">
							<SearchIcon />
							<input
								placeholder="Search"
								type="text"
								value={info.search}
								onChange={(e) => handleSearchChange(e)}
							/>
						</div>

						<button className="proposal-popup-search-div-button">
							+ Blank document
						</button>
					</div>
					<div className="proposal-popup-body-options-container">
						{options.map((option) => (
							<div
								className={`proposal-popup-body-option ${
									info.selectedOption === option ? 'selected' : ''
								}`}
								onClick={() =>
									setInfo((prev) => ({ ...prev, selectedOption: option }))
								}
							>
								{option}
							</div>
						))}
					</div>
				</div>
				{info?.loading ? (
					<div className="proposal-popup-body-loading-container">
						<Skeleton height={600} width={720} />
					</div>
				) : (
					<InfiniteScroll
						dataLength={info?.workflowTemplates?.length || 0}
						hasMore={info?.hasNextPage}
						next={fetchMoreMyWorkflows}
						loader={[{}, {}, {}]?.map((ele, index) => (
							<Skeleton key={index} height={258} width={232} />
						))}
						style={{
							display: 'flex',
							flexDirection: 'row',
							flexWrap: 'wrap',
							flexFlow: 'wrap',
							alignItems: 'flex-end',
							alignContent: 'flex-start',
							// gap: '8px',
							rowGap: '50px',
							columnGap: '10px',
							width: '100%',
							overflowX: 'hidden',
						}}
						className="tetsing"
						height="calc(100vh - 340px)"
					>
						{info?.workflowTemplates?.map((template, index) => (
							<div
								key={index}
								className="docsTemplateCard"
								onClick={() => handleTemplateClick(template)}
							>
								<div className="docsTemplateImageContainer">
									<iframe
										src={`${origin}/preview/${template?._id}?module=${template?.moduleTemplates?.[0]?._id}&isPubic=${template?.moduleTemplates?.[0]?.isPublic}&restrictClick=true`}
										title="Builder Preview"
										width="100%"
										height="100%"
										onClick={(e) => e.stopPropagation()}
										onMouseDown={(e) => e.stopPropagation()}
										onMouseUp={(e) => e.stopPropagation()}
										style={{
											zoom: 0.3,
											pointerEvents: 'none',
										}}
									/>
								</div>
								<div className="docsFooterContent">
									<span
										className="docsFooterContentTitle"
										title={template?.title || 'Template Card'}
									>
										{template?.title || 'Template Card'}
									</span>
									<span className="docsFooterContentSubTitle">
										Created On:{' '}
										{template?.createdAt
											? moment.unix(template?.createdAt).format('DD MMM YYYY')
											: ''}
									</span>
								</div>
							</div>
						))}
					</InfiniteScroll>
				)}
			</div>
		</ReactModal>
	);
};

export default memo(ProposalPopup);
