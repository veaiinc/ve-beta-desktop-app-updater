import React, { memo, useState, useContext, useEffect, useCallback } from 'react';
import '../../../assets/scss/forms/index.scss';
import { FetchMoreLoaderComp, fetchOriginSelection } from '../../../helpers';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'antd';
import FilterPopUp from '../../components/globalComponents/FilterPopUp';
import { FilterIcons, Filters, DocsStatusButton, statusTextmapper } from '../docs/Docs';
import { ReactComponent as CrossPurple } from '../../../assets/svg/docs/cross.svg';
import { ReactComponent as Search } from '../../../assets/svg/docs/search.svg';
import { ReactComponent as Filter } from '../../../assets/svg/docs/filter.svg';
import { ReactComponent as ThreeDots } from '../../../assets/svg/docs/three-dots.svg';
import { ReactComponent as Cross } from '../../../assets/svg/docs/cross.svg';
import Skeleton from 'react-loading-skeleton';
import InfiniteScroll from 'react-infinite-scroll-component';
import Context from '../../../context/context';
import DropDown from '../../components/dropDown/tasks/DropDown';
import QuickActions from '../../components/globalComponents/QuickActions';
import SearchSvg from '../../../assets/svg/activity/SearchSvg';
import CrossSvg from '../../../assets/svg/docs/CrossSvg';
import FilterSvg from '../../../assets/svg/my_templates/FilterSvg';
import ThreeDotsSvg from '../../../assets/svg/my_templates/ThreeDotsSvg';
import ProposalsPopup from '../../components/docs/ProposalsPopup';

// let origin = fetchOriginSelection();

const Forms = () => {
	const navigate = useNavigate();

	const {
		templates: { getTemplatesListForForms, formsTemplatesList, moreFormsTemplatesList },
	} = useContext(Context);
	const [info, setInfo] = useState({
		appliedFilters: [],
		currentPage: 1,
		hasNextPage: true,
		loading: true,
		formsData: [],
		searchValue: '',
		searchExpand: false,
		openProposalPopup: false,
	});

	const suggestedOptions = [
		{
			id: 0,
			title: `Create new Form`,
			value: 'form-submission',
			controlValue: 'form',
			action: ({ setInfo, info }) => {
				setInfo({ ...info, openProposalPopup: true, commonState: 'form-submission' });
			},
		},
	];

	useEffect(() => {
		fetchInitialForms();
	}, []);

	useEffect(() => {
		if (formsTemplatesList) {
			setInfo((prev) => ({
				...prev,
				formsData: formsTemplatesList?.data || [],
				hasNextPage: formsTemplatesList?.hasNextPage || false,
				loading: false,
			}));
		}
	}, [formsTemplatesList]);

	useEffect(() => {
		if (moreFormsTemplatesList) {
			setInfo((prev) => ({
				...prev,
				formsData: [...prev?.formsData, ...(moreFormsTemplatesList?.data || [])],
				hasNextPage: moreFormsTemplatesList?.hasNextPage || false,
				loading: false,
			}));
		}
	}, [moreFormsTemplatesList]);

	const fetchInitialForms = useCallback(async () => {
		setInfo((prev) => ({ ...prev, loading: true }));
		await getTemplatesListForForms(1, 20);
	}, []);

	const fetchMoreForms = useCallback(async () => {
		if (info?.hasNextPage) {
			const nextPage = info?.currentPage + 1;
			await getTemplatesListForForms(nextPage, 20, true);
			setInfo((prev) => ({
				...prev,
				currentPage: nextPage,
			}));
		}
	}, [info?.hasNextPage, info?.currentPage]);

	const handleFormClick = useCallback((formData) => {
		navigate(`/form/${formData?._id}`, { state: { formData } });
	}, []);

	return (
		<>
			<div className="formsParentContainer">
				<div className="formsHeaderContainer">
					<div className="headerText">
						<span className="lineOne">Forms</span>
						<span className="lineTwo">You Created</span>
					</div>
					<div className="quickActionsBtn">
						<QuickActions suggestedOptions={suggestedOptions} />
					</div>
				</div>
				<div className="formsParentHeaderContainer">
					{/* <div className="formsHeaderButtons " onClick={() => {}}>
					<div className="formsHeaderButtonsTitle">Let's Create a Form</div>
					<div className="formsHeaderSubButtonsSubTitleColored colorful">
						Start with AI
					</div>
				</div>
				<div className="formsHeaderButtons">
					{' '}
					<div className="formsHeaderButtonsTitle">Import file or URL</div>
					<div className="formsHeaderSubButtonsSubTitle">
						Pick your template from playbook
					</div>
				</div> */}
					<div
						onClick={() => setInfo((prev) => ({ ...prev, openProposalPopup: true }))}
						className="formsHeaderButtons"
					>
						{' '}
						<div className="formsHeaderButtonsTitle">
							Create form from your template
						</div>
						<div className="formsHeaderSubButtonsSubTitle">
							Pick your template from playbook
						</div>
					</div>
				</div>

				<div className="formsContainer">
					<div className="formsHeaderContainer">
						<div className="formsHeaderContainerTitle">
							<span>Forms</span>
							<div className="appliedFiltersContainer">
								{info?.appliedFilters?.map((appliedFilter, idx) => (
									<Tooltip
										key={idx}
										trigger="click"
										arrow={false}
										color="transparent"
										onOpenChange={(isOpen) => {
											if (!isOpen) {
												setInfo((prev) => ({
													...prev,
													searchValue: '',
												}));
											}
										}}
										overlayClassName="filterTooltipPopUpContainer"
										placement="bottomLeft"
										title={
											<FilterPopUp
												className={`${appliedFilter?.filter}`}
												height="268px"
												options={
													info?.[appliedFilter?.filterOptionsListName]
												}
												onOptionClick={() => {}}
												fetchMoreOptions={() => {}}
												hasMoreOptions={
													info?.hasMoreForFilter?.[appliedFilter?.filter]
												}
												searchInput={true}
												searchInputPlaceholder="Filter By"
												searchValue={info?.searchValue}
												setSearchValue={() => {}}
											/>
										}
									>
										<div className="appliedFilter">
											{FilterIcons?.[appliedFilter?.filter]}
											<span className="filter">
												{appliedFilter?.label} :{' '}
												{info?.selectedFilterOptions?.[
													appliedFilter?.filter
												]?.name ??
													info?.selectedFilterOptions?.[
														appliedFilter?.filter
													]?.title ??
													''}
											</span>
											<span className="removeFilterBtn" onClick={() => {}}>
												<CrossPurple />
											</span>
										</div>
									</Tooltip>
								))}
							</div>
						</div>

						<div className="formsHeaderContainerActionsContainer">
							<div
								className="searchContainer"
								style={{
									width: info?.searchExpand ? '140px' : '16px',
								}}
							>
								<div
									className={`searchBtn ${
										info?.searchExpand ? 'searchExpand' : ''
									}`}
								>
									<span
										style={{
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											cursor: 'pointer',
										}}
										onClick={() =>
											setInfo((prev) => ({
												...prev,
												searchExpand: true,
											}))
										}
									>
										<SearchSvg />
									</span>

									<div className="inputAndCloseContainer">
										<input
											className="searchInputTag"
											placeholder="Search"
											value={info?.searchValue}
											onChange={(e) =>
												setInfo((prev) => ({
													...prev,
													searchValue: e?.target?.value,
												}))
											}
										/>
										<span
											style={{
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center',
												cursor: 'pointer',
											}}
											onClick={() => {
												setInfo((prev) => ({
													...prev,
													searchExpand: false,
													searchValue: '',
												}));
											}}
										>
											<CrossSvg />
										</span>
									</div>
								</div>
							</div>
							<DropDown
								title="Add Filters"
								options={Filters}
								valueSelector="valueSelector"
								containerStyles={{
									borderRadius: '14px',
									background: '#202123',
									boxShadow: '0px 2px 44px 0px rgba(0, 0, 0, 0.25)',
								}}
								onOptionClick={() => {}}
							>
								<FilterSvg />
							</DropDown>
							<ThreeDotsSvg />
						</div>
					</div>

					<div className="formsInfiniteContainer">
						{info?.loading ? (
							[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]?.map(
								(ele, index) => <Skeleton key={index} height={36} />,
							)
						) : (
							<InfiniteScroll
								dataLength={info?.formsData?.length || 0}
								next={fetchMoreForms}
								hasMore={info?.hasNextPage}
								loader={<FetchMoreLoaderComp />}
								style={{
									display: 'flex',
									flexDirection: 'column',
									gap: '8px',
									width: '100%',
								}}
								className="tetsing"
								height="calc(100vh - 310px)"
							>
								{info?.formsData?.map((ele, index) => (
									<div
										className="docsRow"
										key={index}
										onClick={() => {
											handleFormClick(ele);
										}}
									>
										<div className="docsFilesRowTitle">{ele?.title}</div>
										<div className="docsKeyWordsContainer">
											{ele?.clientDetails?.name ? (
												<span className="docsclientdetailsName">
													{ele?.clientDetails?.name}
												</span>
											) : (
												''
											)}

											<DocsStatusButton
												content={statusTextmapper?.[ele?.status]?.text}
												style={statusTextmapper?.[ele?.status]?.style}
												dotStyle={statusTextmapper?.[ele?.status]?.dotStyle}
											/>
										</div>
									</div>
								))}
							</InfiniteScroll>
						)}
					</div>
				</div>
			</div>
			<ProposalsPopup
				open={info?.openProposalPopup}
				closeModal={() => setInfo((prev) => ({ ...prev, openProposalPopup: false }))}
				clientDetails={formsTemplatesList}
				commonState={'form-submission'}
			/>
		</>
	);
};

export default memo(Forms);
