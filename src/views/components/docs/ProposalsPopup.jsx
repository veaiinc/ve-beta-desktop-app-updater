import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import ReactModal from '../modalsV2';
import { ReactComponent as CrossSvg } from '../../../assets/svg/gallery/cross.svg';
import { ReactComponent as SearchIcon } from '../../../assets/svg/workflow/search.svg';
import '../../../assets/scss/docs/proposalsPopup.scss';
import Context from '../../../context/context';
import TemplateCards from '../myTemplate/TemplateCards';

const options = ['All', 'Proposal', 'Invoice', 'Contract', 'Thank you', 'Proposal'];

const initialState = {
	search: '',
	selectedOption: 'All',
	loading: true,
	workflowTemplates: [],
	hasNextPage: false,
	currentPage: 1,
};

const ProposalPopup = ({ open, closeModal }) => {
	const [info, setInfo] = useState({
		...initialState,
	});

	const {
		templates: { getMyWorkflows, myWorkflows, myMoreWorkflows },
	} = useContext(Context);

	useEffect(() => {
		getMyWorkflowsTemplatesData(1);
		return () => {
			setInfo((prev) => ({
				...prev,
				...initialState,
			}));
		};
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

	const getMyWorkflowsTemplatesData = useCallback(
		(page, fetchMore = false) => {
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
			if (info?.search) {
				payload.filters.name = info?.search;
			}
			getMyWorkflows(payload, fetchMore);
		},
		[info?.search],
	);

	const fetchMoreMyWorkflows = useCallback(() => {
		getMyWorkflowsTemplatesData(info?.currentPage + 1, true);
	}, [info?.hasNextPage, info?.currentPage]);

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

	return (
		<ReactModal isOpen={open} closeModal={closeModal} modalType={'center'}>
			<div className="proposal-popup-container">
				<div className="proposal-popup-header">
					<div className="proposal-popup-header-text">Choose Template</div>
					<CrossSvg onClick={closeModal} />
				</div>
				<div className="proposal-popup-body">
					<div className="proposal-popup-search-div">
						<div className="proposal-popup-search-div-input-container">
							<SearchIcon />
							<input
								placeholder="Search"
								type="text"
								value={info.search}
								onChange={(e) =>
									setInfo((prev) => ({ ...prev, search: e.target.value }))
								}
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
				<TemplateCards
					data={info?.workflowTemplates}
					loading={info?.loading}
					hasNextPage={info?.hasNextPage}
					fetchMoreMyWorkflows={fetchMoreMyWorkflows}
					loaders={[{}, {}, {}, {}, {}, {}]}
				/>
			</div>
		</ReactModal>
	);
};

export default memo(ProposalPopup);
