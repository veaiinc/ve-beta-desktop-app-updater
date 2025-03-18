import React, { memo, useCallback, useContext, useEffect, useState, useRef } from 'react';
import Skeleton from 'react-loading-skeleton';
import InfiniteScroll from 'react-infinite-scroll-component';
import ReactModal from '../modalsV2';
import { ReactComponent as CrossSvg } from '../../../assets/svg/gallery/cross.svg';
import { ReactComponent as SearchIcon } from '../../../assets/svg/workflow/search.svg';
import { ReactComponent as FilterSvg } from '../../../assets/svg/docs/filter.svg';
import '../../../assets/scss/docs/proposalsPopup.scss';
import { fetchOriginSelection } from '../../../helpers';
import Context from '../../../context/context';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'antd';
import CreateFileLead from '../myTemplate/CreateFileLead';
const origin = fetchOriginSelection();

const initialState = {
	search: '',
	selectedOption: 'All',
	loading: true,
	workflowTemplates: [],
	activeTemplateData: null,
	hasNextPage: false,
	currentPage: 1,
	loading: false,
	timeout: null,
	searchChanged: false,
	versionPopup: false,
	smartfileIdFromExistingClient: null,
	filterOption: false,
};
const customStyles = {
	content: { zIndex: 999 },
	overlay: { zIndex: 998 },
};

const ProposalPopup = ({ open, closeModal, clientDetails = null, commonState }) => {
	const {
		templates: {
			getMyWorkflowsForProposalPopup,
			myWorkflowsForProposalPopup,
			myMoreWorkflowsForProposalPopup,
			createLeadfromTemplates,
			duplicateGlobalWorkflowTemplate,
		},
		activityInfo: { createSmartfile, smartfile },
		profileInfo: { tenantUserAccessControls },
	} = useContext(Context);

	const hasAccessToWorkflows = tenantUserAccessControls?.accessControls?.find(
		(accessControl) => accessControl?.app === 'workflow',
	);

	const filterOptions = hasAccessToWorkflows
		? [
				{ id: 1, title: 'All', value: '' },
				{ id: 2, title: 'Form', value: 'form-submission' },
				{ id: 3, title: 'Proposal', value: 'proposal' },
				{ id: 4, title: 'Presentation', value: 'presentation' },
				{ id: 5, title: 'Invoice', value: 'invoice' },
				{ id: 6, title: 'Contract', value: 'contract' },
		  ]
		: [{ id: 1, title: 'Form', value: 'form-submission' }];

	const [info, setInfo] = useState({
		...initialState,
	});

	useEffect(() => {
		setInfo((prev) => ({ ...prev, selectedOption: commonState }));
	}, [commonState]);

	useEffect(() => {
		if (info?.selectedOption !== 'All' && open) {
			getMyWorkflowsTemplatesData(1, info?.search, false, info?.selectedOption);
		} else {
			if (open && !myWorkflowsForProposalPopup?.length) getMyWorkflowsForProposalPopup(1);
		}
	}, [info?.selectedOption]);

	useEffect(() => {
		if (myWorkflowsForProposalPopup && open) {
			myWorkflowsDataParser(myWorkflowsForProposalPopup);
		}
	}, [myWorkflowsForProposalPopup]);

	useEffect(() => {
		if (myMoreWorkflowsForProposalPopup && open) {
			myWorkflowsDataParser(myMoreWorkflowsForProposalPopup, true);
		}
	}, [myMoreWorkflowsForProposalPopup]);

	useEffect(() => {
		if (smartfile?._id && info?.activeTemplateData?._id) {
			window.location.href = `${origin}/workflow/${smartfile?._id}?workflow=true&templateId=${info?.activeTemplateData?._id}`;
		}
	}, [smartfile]);

	useEffect(() => {
		if (info?.smartfileIdFromExistingClient) {
			window.location.href = `${origin}/workflow/${info?.smartfileIdFromExistingClient}?workflow=true&templateId=${info?.activeTemplateData?._id}`;
		}
	}, [info?.smartfileIdFromExistingClient]);

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

		setInfo((prev) => ({ ...prev, loading: true, activeTemplateData: template }));

		let payload = null;

		if (clientDetails && clientDetails?.name) {
			payload = {
				workflowInput: {
					clientDetails: {
						name: clientDetails?.['name'],
					},
					templateId: template?._id,
					title: clientDetails?.['name'],
				},
			};
		} else {
			if (info?.selectedOption !== 'form-submission') {
				payload = {
					smartFileInput: {
						title: template?.title,
						templateId: template?._id,
					},
				};
			} else {
				payload = {
					title: template?.title,
					templateId: template?._id,
				};
			}
		}

		try {
			if (clientDetails && clientDetails?.name) {
				const response = await createLeadfromTemplates(payload);
				if (response?.[0]) {
					setInfo((prev) => ({
						...prev,
						smartfileIdFromExistingClient: response?.[1],
					}));
				}
			} else {
				if (info?.selectedOption !== 'form-submission') {
					await createSmartfile(payload);
				} else {
					const res = await duplicateGlobalWorkflowTemplate(payload);
					if (res?.[0]) {
						window.location.href = `${origin}/${res?.[1]?._id}`;
					}
				}
			}
		} catch (error) {
			console.error('Failed to create smartfile:', error);
		} finally {
			setInfo((prev) => ({ ...prev, loading: false }));
		}
	};
	const versionClick = (template) => {
		setInfo((prev) => ({ ...prev, versionPopup: true, activeTemplateData: template }));
	};

	const getMyWorkflowsTemplatesData = useCallback(
		(page, search = null, fetchMore = false, selectedOption = '') => {
			const payload = {
				filters: {
					limit: 9,
					page: page,
					type: 'workspace',
					status: 'published',
					sortType: -1,
					sortBy: 'createdAt',
				},
			};
			if (search) {
				payload.filters.title = search;
			}
			if (selectedOption !== 'All') {
				payload.filters.action = selectedOption;
			}
			getMyWorkflowsForProposalPopup(payload, fetchMore);
		},
		[],
	);

	const fetchMoreMyWorkflows = useCallback(() => {
		getMyWorkflowsTemplatesData(
			info?.currentPage + 1,
			info?.search,
			true,
			info?.selectedOption,
		);
	}, [info?.hasNextPage, info?.currentPage, info?.search, info?.selectedOption]);

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

						{/* <button className="proposal-popup-search-div-button">
							+ Blank document
						</button> */}
					</div>
					<div className="proposal-popup-body-options-container-wrapper">
						<div className="proposal-popup-body-options-container">
							{filterOptions.map((option, index) => (
								<div
									key={index}
									className={`proposal-popup-body-option ${
										info.selectedOption === option?.value ? 'selected' : ''
									}`}
									onClick={(e) => {
										e.stopPropagation();
										setInfo((prev) => ({
											...prev,
											selectedOption: option?.value,
										}));
									}}
								>
									{option?.title}
								</div>
							))}
						</div>
						{/* <div
							className="proposal-popup-body-options-container-filters"
							onClick={(e) => {
								e.stopPropagation();
								setInfo((prev) => ({ ...prev, filterOption: !prev.filterOption }));
							}}
							style={{ cursor: 'pointer' }}
						>
							<span>Filters</span>
							<Tooltip
								open={info?.filterOption}
								onOpenChange={() =>
									setInfo((prev) => ({
										...prev,
										filterOption: !prev.filterOption,
									}))
								}
								placement="bottom"
								title={
									<div className="proposal-popup-body-options-container-filters-tooltip">
										<span
											className="proposal-popup-body-options-container-filters-tooltip-title"
											onClick={() =>
												setInfo((prev) => ({
													...prev,
													optionSelected: 'Last Modified',
												}))
											}
										>
											Last Modified
										</span>
									</div>
								}
								arrow={false}
								trigger="click"
								color="transparent"
							>
								<FilterSvg />
							</Tooltip>
						</div> */}
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
								onClick={() =>
									template?.version
										? handleTemplateClick(template)
										: versionClick(template)
								}
							>
								<div className="docsTemplateImageContainer">
									<iframe
										src={`${origin}/preview/short/${template?._id}?module=${template?.moduleTemplates?.[0]?._id}&isPubic=${template?.moduleTemplates?.[0]?.isPublic}&restrictClick=true`}
										title="Builder Preview"
										width="100%"
										height="100%"
										onClick={(e) => e.stopPropagation()}
										onMouseDown={(e) => e.stopPropagation()}
										onMouseUp={(e) => e.stopPropagation()}
										style={{
											// zoom: 0.3,
											backgroundColor: '#fff',
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
			<CreateFileLead
				open={info?.versionPopup}
				onClose={() => setInfo((prev) => ({ ...prev, versionPopup: false }))}
				workflow={info?.activeTemplateData}
			/>
		</ReactModal>
	);
};

export default memo(ProposalPopup);
