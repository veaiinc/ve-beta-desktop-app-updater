import { memo, forwardRef } from 'react';
import s from './productIntro.module.scss';
import { ReactComponent as LightPassingSvg } from '../../../assets/svg/landingScreen/LightPassing.svg';

const ProductIntro = forwardRef((props, ref) => {
	const intelligenceTypes = [
		{
			number: '1',
			title: 'AMBIENT INTELLIGENCE',
			description:
				'Ambient intelligence is technology designed to fade into the background while actively supporting people. It senses context, understands behaviour, and adapts seamlessly to user needs without requiring explicit commands. By proactively assisting whether by surfacing relevant information.',
		},
		{
			number: '2',
			title: 'DESKTOP INTELLIGENCE',
			description:
				'Ambient intelligence is technology designed to fade into the background while actively supporting people. It senses context, understands behaviour, and adapts seamlessly to user needs without requiring explicit commands. By proactively assisting—whether by surfacing relevant information.',
		},
		{
			number: '3',
			title: 'MEETING INTELLIGENCE',
			description:
				'Ambient intelligence is technology designed to fade into the background while actively supporting people. It senses context, understands behaviour, and adapts seamlessly to user needs without requiring explicit commands. By proactively assisting—whether by surfacing relevant information.',
		},
		{
			number: '4',
			title: 'SUPER AGENTS',
			description:
				'Ambient intelligence is technology designed to fade into the background while actively supporting people. It senses context, understands behaviour, and adapts seamlessly to user needs without requiring explicit commands. By proactively assisting—whether by surfacing relevant information.',
		},
	];

	return (
		<div ref={ref} className={s.ProductIntro}>
			{/* Animated Background Glow Effect */}
			<div className={s.glowContainer}>
				<div className={s.ball} style={{ '--size': '0.6', '--speed': '12s' }}></div>
				<div
					className={s.ball}
					style={{ '--delay': '-8s', '--size': '0.4', '--speed': '15s' }}
				></div>
				<div
					className={s.ball}
					style={{ '--delay': '-4s', '--size': '0.3', '--speed': '10s' }}
				></div>
			</div>

			<div className={s.heroSection} data-hero-section="true">
				<h1 className={s.mainTitle}>
					Personal
					<br />
					Perspectives
				</h1>
				<p className={s.subtitle}>
					One intelligent system that listens, learns,and acts making search faster,
					meetings smarter, and work seamless
				</p>
			</div>

			<div className={s.intelligenceSection}>
				{intelligenceTypes.map((item, index) => (
					<div key={index} className={s.intelligenceItem}>
						<div className={s.content}>
							<h3 className={s.intelligenceTitle}>{item.title}</h3>
							<p className={s.intelligenceDescription}>{item.description}</p>
						</div>
						<div className={s.number}>{item.number}</div>
					</div>
				))}
			</div>

			<div className={s.lightPassing}>
				<LightPassingSvg />
			</div>
		</div>
	);
});

ProductIntro.displayName = 'ProductIntro';

export default memo(ProductIntro);
