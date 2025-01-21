import React, { memo, useState } from 'react';
import '../../../assets/scss/forms/index.scss';
import { FetchMoreLoaderComp, fetchOriginSelection } from '../../../helpers';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'antd';
import FilterPopUp from '../../components/globalComponents/FilterPopUp';
import { FilterIcons, Filters } from '../../features/docs';
import { ReactComponent as CrossPurple } from '../../../assets/svg/docs/cross.svg';
import { ReactComponent as Search } from '../../../assets/svg/docs/search.svg';
import { ReactComponent as Filter } from '../../../assets/svg/docs/filter.svg';
import { ReactComponent as ThreeDots } from '../../../assets/svg/docs/three-dots.svg';
import { ReactComponent as Cross } from '../../../assets/svg/docs/cross.svg';
import DropDown from '../../components/dropDown/tasks/DropDown';

let origin = fetchOriginSelection();

const Forms = () => {
	const [info, setInfo] = useState({
		appliedFilters: [],
	});
	// const navigate = useNavigate();
	// const onGenerateAIFunc = () => {
	// 	window.location.href = `${origin}/generate`;
	// };

	return (
		<div className="formsParentContainer">
			<div className="formsParentHeaderContainer">
				<div className="formsHeaderButtons " onClick={() => {}}>
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
				</div>
				<div onClick={() => {}} className="formsHeaderButtons">
					{' '}
					<div className="formsHeaderButtonsTitle">Create form from your template</div>
					<div className="formsHeaderSubButtonsSubTitle">
						Pick your template from playbook
					</div>
				</div>
			</div>

			<div className="formsContainer">
				<div className="formsFileHeaderContainer">
					<div className="formsFileHeaderContainerTitle">
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
											options={info?.[appliedFilter?.filterOptionsListName]}
											// onOptionClick={(option) =>
											// 	handleSetFilterOptions(
											// 		option,
											// 		appliedFilter?.filter,
											// 	)
											// }
											onOptionClick={() => {}}
											// fetchMoreOptions={() =>
											// 	fetchMoreDocs(appliedFilter?.filter)
											// }
											fetchMoreOptions={() => {}}
											hasMoreOptions={
												info?.hasMoreForFilter?.[appliedFilter?.filter]
											}
											searchInput={true}
											searchInputPlaceholder="Filter By"
											searchValue={info?.searchValue}
											// setSearchValue={handleFilterPopUpSearch}
											setSearchValue={() => {}}
										/>
									}
								>
									<div className="appliedFilter">
										{FilterIcons?.[appliedFilter?.filter]}
										<span className="filter">
											{appliedFilter?.label} :{' '}
											{info?.selectedFilterOptions?.[appliedFilter?.filter]
												?.name ??
												info?.selectedFilterOptions?.[appliedFilter?.filter]
													?.title ??
												''}
										</span>
										<span
											className="removeFilterBtn"
											// onClick={() =>
											// 	handleRemoveSelectedFilter(appliedFilter?.filter)
											// }
											onClick={() => {}}
										>
											<CrossPurple />
										</span>
									</div>
								</Tooltip>
							))}
						</div>
					</div>

					<div className="formsFileHeaderContainerActionsContainer">
						<div
							className="searchContainer"
							style={{
								width: info?.searchExpand ? '140px' : '16px',
							}}
						>
							<div
								className={`searchBtn ${info?.searchExpand ? 'searchExpand' : ''}`}
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
									<Search />
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
										<Cross style={{ width: '20px', height: '20px' }} />
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
							// onOptionClick={handleSetActiveFilter}
							onOptionClick={() => {}}
						>
							<Filter style={{ width: '20px', height: '20px', marginTop: '6px' }} />
						</DropDown>
						<ThreeDots />
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(Forms);
