import React, { memo, useCallback, useState } from 'react';
import '../../../assets/scss/ai_agents/jobs.scss';
import { ReactComponent as CircledCross } from '../../../assets/svg/ai_agents/cross.svg';
import { ReactComponent as Search } from '../../../assets/svg/ai_agents/search.svg';
import AgentsWorkflows from '../../components/ai_agents/ai_agents_jobs/AgentsWorkflows';
const AgentsJobs = () => {
	const [info, setInfo] = useState({
		search: '',
		searchExpand: false,
		activeTab: 'workflows', //workflows,tasks,actions
	});
	const onSearchChange = useCallback((e) => {
		setInfo((prev) => ({ ...prev, search: e?.target?.value }));
	}, []);

	const toggleActiveTab = useCallback(
		(data) => {
			if (data === info?.activeTab) {
				return;
			}

			setInfo((prev) => ({ ...prev, activeTab: data }));
		},
		[info?.activeTab],
	);
	return (
		<div className="aiAgentsJobsParentContainer">
			{/* header */}
			<div className="aiAgentsJobHeaderContainer">
				<span className="aiAgentsJobsTitle">Jobs of Da Vinci</span>
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
			{/* tab container */}

			<div className="aiAgentsJobsTabContainer">
				<div
					className="aiAgentsJobsTabButtons"
					onClick={() => toggleActiveTab('workflows')}
					style={{
						borderBottom: info?.activeTab === 'workflows' ? '2px solid #e8e8e8' : '',
					}}
				>
					Workflows
				</div>
				<div
					className="aiAgentsJobsTabButtons"
					onClick={() => toggleActiveTab('tasks')}
					style={{
						borderBottom: info?.activeTab === 'tasks' ? '2px solid #e8e8e8' : '',
					}}
				>
					Tasks
				</div>
				<div
					className="aiAgentsJobsTabButtons"
					onClick={() => toggleActiveTab('actions')}
					style={{
						borderBottom: info?.activeTab === 'actions' ? '2px solid #e8e8e8' : '',
					}}
				>
					Actions
				</div>
			</div>

			<AgentsWorkflows />
		</div>
	);
};

export default memo(AgentsJobs);
