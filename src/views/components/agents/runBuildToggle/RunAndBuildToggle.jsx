import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import s from './runAndBuildToggle.module.scss';

// svgs
import Andriod from './assets/Andriod';
import Build from './assets/Build';
import { ReactComponent as BackIcon } from './assets/back.svg';

const RunAndBuildToggle = ({ agentAction, setAgentAction }) => {
	const navigate = useNavigate();
	return (
		<div className={s.container}>
			{/* <button onClick={() => navigate('/agents')} className={s.backBtn}>
				<BackIcon />
				<span>Back to Agents</span>
			</button> */}
			<div className={s.runAndBuildToggle}>
				<button
					className={
						agentAction === 'runAgent' ? `${s.toogleBtn} ${s.active}` : s.toogleBtn
					}
					onClick={() => setAgentAction('runAgent')}
				>
					<Andriod active={agentAction === 'runAgent'} />
					<span className={agentAction === 'runAgent' ? `${s.btnText} ${s.active}` : ''}>
						Run agent
					</span>
				</button>
				<button
					className={
						agentAction === 'buildAgent' ? `${s.toogleBtn} ${s.active}` : s.toogleBtn
					}
					onClick={() => setAgentAction('buildAgent')}
				>
					<Build active={agentAction === 'buildAgent'} />
					<span
						className={agentAction === 'buildAgent' ? `${s.btnText} ${s.active}` : ''}
					>
						Build
					</span>
				</button>
			</div>
		</div>
	);
};

export default memo(RunAndBuildToggle);
