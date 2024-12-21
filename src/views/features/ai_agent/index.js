import React, { memo, useCallback, useState } from 'react';
import '../../../assets/scss/ai_agents/home.scss';
import { ReactComponent as CircledCross } from '../../../assets/svg/ai_agents/cross.svg';
import { ReactComponent as Search } from '../../../assets/svg/ai_agents/search.svg';
import AiAgentsCards from '../../components/ai_agents/AiAgentsCards';
import CreateCards from '../../components/ai_agents/CreateCards';
const tabs = ['all', 'guidence', 'approval', 'suggestions'];
const cards = [
	{ cardType: 'workflow', title: 'Workflow Name - 1', type: 'guidance' },
	{ cardType: 'workflow', title: 'Workflow Name - 2', type: 'approval' },
	{ cardType: 'meeting', title: 'Create a Meeting', status: 'upcoming', type: 'actions' },
	{ cardType: 'tasks', title: 'Generate a Smart File', status: 'completed', type: 'tasks' },
];

const AiAgent = () => {
	const [info, setInfo] = useState({
		activeTab: 'all',
		search: '',
		searchExpand: false,
	});

	//function definations
	const toggleActiveTab = useCallback(
		(data) => {
			if (data === info?.activeTab) {
				return;
			}

			setInfo((prev) => ({ ...prev, activeTab: data }));
		},
		[info?.activeTab],
	);
	const onSearchChange = useCallback((e) => {
		setInfo((prev) => ({ ...prev, search: e?.target?.value }));
	}, []);

	return (
		<div className="aiAgentsParentContainer">
			<span className="aiAgentsNameStyling">Da Vinci</span>

			<div className="aiAgentsContentContainer">
				<span className="aiagentsheaderStyuling">Pending Actions & Suggestions</span>
				{/* filters and tab container */}
				<div className="filtersAndTabContainer">
					<div className="agentsTabContainer">
						{/* filtersCards */}

						{tabs?.map((ele, index) => (
							<div
								className="agentsFiltersTab"
								key={index}
								onClick={() => toggleActiveTab(ele)}
								style={{
									backgroundColor: info?.activeTab === ele ? '#fff' : '',
									color: info?.activeTab === ele ? '#0E0F0F' : '',
								}}
							>
								{ele}
							</div>
						))}
					</div>
					<div className={`searchBtn ${info?.searchExpand ? 'searchExpand' : ''}`}>
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
								value={info?.search}
								onChange={onSearchChange}
							/>
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
										searchValue: '',
										searchValueChanged: true,
										searchExpand: false,
									}))
								}
							>
								<CircledCross />
							</span>
						</div>
					</div>
				</div>
				{/* //cards container */}
				<div className="aiAgentsCardContainer">
					{cards?.map((ele, index) => (
						<AiAgentsCards key={index} data={ele} />
					))}
				</div>
			</div>
			<CreateCards />
		</div>
	);
};

export default memo(AiAgent);
