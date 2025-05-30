import { memo } from 'react';
import s from './runAndBuildToggle.module.scss';

// svgs
import Andriod from './assets/Andriod';
import Build from './assets/Build';

const RunAndBuildToggle = ({ activeToggle, setActiveToggle }) => {
	return (
		<div className={s.container}>
			<div className={s.runAndBuildToggle}>
				<button
					className={
						activeToggle === 'runAgent' ? `${s.toogleBtn} ${s.active}` : s.toogleBtn
					}
					onClick={() => setActiveToggle('runAgent')}
				>
					<Andriod active={activeToggle === 'runAgent'} />
					<span className={activeToggle === 'runAgent' ? `${s.btnText} ${s.active}` : ''}>
						Run agent
					</span>
				</button>
				<button
					className={
						activeToggle === 'buildAgent' ? `${s.toogleBtn} ${s.active}` : s.toogleBtn
					}
					onClick={() => setActiveToggle('buildAgent')}
				>
					<Build active={activeToggle === 'buildAgent'} />
					<span
						className={activeToggle === 'buildAgent' ? `${s.btnText} ${s.active}` : ''}
					>
						Build
					</span>
				</button>
			</div>
		</div>
	);
};

export default memo(RunAndBuildToggle);
