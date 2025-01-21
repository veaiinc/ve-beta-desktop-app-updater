import React, { memo, useState } from 'react';
import '../../../assets/scss/forms/index.scss';
import { FetchMoreLoaderComp, fetchOriginSelection } from '../../../helpers';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'antd';
import FilterPopUp from '../../components/globalComponents/FilterPopUp';

let origin = fetchOriginSelection();

const Forms = () => {
	const [info, setInfo] = useState({
		appliedFilters: [],
	});
	const navigate = useNavigate();
	const onGenerateAIFunc = () => {
		window.location.href = `${origin}/generate`;
	};

	return (
		<div className="formsParentContainer">
			<div className="docsParentHeaderContainer">
				<div
					className="docsHeaderButtons "
					onClick={() => {}}
					// onClick={onGenerateAIFunc}
				>
					<div className="docsHeaderButtonsTitle">Let’s Create a Form</div>
					<div className="docsHeaderSubButtonsSubTitleColored colorful">
						Start with AI
					</div>
				</div>
				<div className="docsHeaderButtons">
					{' '}
					<div className="docsHeaderButtonsTitle">Import file or URL</div>
					<div className="docsHeaderSubButtonsSubTitle">
						Pick your template from playbook
					</div>
				</div>
				<div
					// onClick={() => navigate('/my-templates')}
					onClick={() => {}}
					className="docsHeaderButtons"
				>
					{' '}
					<div className="docsHeaderButtonsTitle">Create form from your template</div>
					<div className="docsHeaderSubButtonsSubTitle">
						Pick your template from playbook
					</div>
				</div>
			</div>

			<div className="formsContainer">
				<div className="docsFileHeaderContainer">
					<div className="docsFileHeaderContainerTitle">
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
									{/* <div className="appliedFilter">
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
											onClick={() =>
												handleRemoveSelectedFilter(appliedFilter?.filter)
											}
										>
											<CrossPurple />
										</span>
									</div> */}
								</Tooltip>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(Forms);
