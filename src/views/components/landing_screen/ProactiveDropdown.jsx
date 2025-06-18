import { memo } from 'react';
import { ReactComponent as SparkleSvg } from '../../../assets/svg/ai_agents/sparkle.svg';
import { ReactComponent as BinocularsSvg } from '../../../assets/svg/landingScreen/binocularsSvg.svg';
import s from '../../../assets/scss/landingScreen/proactiveDropdown.module.scss';
import { Link } from 'react-router-dom';

const ProactiveDropdown = ({ isOpen }) => {
	return (
		<div className={`${s.proactiveDropdown__container} `}>
			<div className={s.left}>
				<div className={s.heading}>
					<SparkleSvg /> Features
				</div>
				<div className={s.listContainer}>
					<div className={s.list}>
						<span>
							<Link to="/">Ambient AI</Link>
						</span>
						<span>
							<Link>Enterprise Search</Link>
						</span>
						<span>
							<Link>AI meeting notes</Link>
						</span>
						<span>
							<Link>Agents</Link>
						</span>
						<span>
							<Link>Build</Link>
						</span>
					</div>
					<div className={s.list}>
						<span>
							<Link>Notes</Link>
						</span>
						<span>
							<Link>Projects</Link>
						</span>
						<span>
							<Link>Docs</Link>
						</span>
						<span>
							<Link>Forms</Link>
						</span>
						<span>
							<Link>Sites</Link>
						</span>
					</div>
					<div className={s.list}>
						<span>
							<Link>Calendar</Link>
						</span>
						<span>
							<Link>Task</Link>
						</span>
						<span>
							<Link>Automation</Link>
						</span>
					</div>
				</div>
			</div>
			<div className={s.right}>
				<div className={s.heading}>
					<BinocularsSvg /> Search
				</div>
				<div className={s.list}>
					<span>
						<Link>Knowledge search</Link>
					</span>
					<span>
						<Link>Internal search</Link>
					</span>
					<span>
						<Link>LLM search</Link>
					</span>
				</div>
			</div>
		</div>
	);
};

export default memo(ProactiveDropdown);
