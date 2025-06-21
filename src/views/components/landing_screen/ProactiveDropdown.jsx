import { memo } from 'react';
import { ReactComponent as SparkleSvg } from '../../../assets/svg/ai_agents/sparkle.svg';
import { ReactComponent as BinocularsSvg } from '../../../assets/svg/landingScreen/binocularsSvg.svg';
import s from '../../../assets/scss/landingScreen/proactiveDropdown.module.scss';
import { Link } from 'react-router-dom';

const linkMapper = {
	features: [
		{
			title: 'Ambient AI',
			path: '/',
		},
		{
			title: 'Enterprise Search',
			path: '/',
		},
		{
			title: 'AI meeting notes',
			path: '/',
		},
		{
			title: 'Agents',
			path: '/',
		},
		{
			title: 'Build',
			path: '/',
		},
		{
			title: 'Notes',
			path: '/',
		},
		{
			title: 'Projects',
			path: '/',
		},
		{
			title: 'Docs',
			path: '/',
		},
		{
			title: 'Forms',
			path: '/',
		},
		{
			title: 'Sites',
			path: '/',
		},
		{
			title: 'Calendar',
			path: '/',
		},
		{
			title: 'Task',
			path: '/',
		},
		{
			title: 'Automation',
			path: '/',
		},
	],
	search: [
		{
			title: 'Knowledge search',
			path: '/',
		},
		{
			title: 'Internal search',
			path: '/',
		},
		{
			title: 'LLM search',
			path: '/',
		},
	],
};

const ProactiveDropdown = ({ isOpen }) => {
	return (
		<div className={`${s.proactiveDropdown__container} `}>
			<div className={s.left}>
				<div className={s.heading}>
					<SparkleSvg /> Features
				</div>
				<div className={s.listContainer}>
					{[0, 1, 2].map((listIndex) => (
						<div key={listIndex} className={s.list}>
							{linkMapper.features
								.slice(listIndex * 5, (listIndex + 1) * 5)
								.map((link, index) => (
									<span key={index}>
										<Link to={link.path}>{link.title}</Link>
									</span>
								))}
						</div>
					))}
				</div>
			</div>
			<div className={s.right}>
				<div className={s.heading}>
					<BinocularsSvg /> Search
				</div>
				<div className={s.list}>
					{linkMapper.search.map((link, index) => (
						<span key={index}>
							<Link to={link.path}>{link.title}</Link>
						</span>
					))}
				</div>
			</div>
		</div>
	);
};

export default memo(ProactiveDropdown);
