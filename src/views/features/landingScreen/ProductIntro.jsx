import { memo } from 'react';
import s from './productIntro.module.scss';

const ProductIntro = () => {
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
		<div className={s.ProductIntro}>
			<div className={s.heroSection}>
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

			<div className={s.lightPassing}></div>
		</div>
	);
};

ProductIntro.displayName = 'ProductIntro';

export default memo(ProductIntro);
