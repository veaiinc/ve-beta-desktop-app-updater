import { memo, forwardRef } from 'react';
import s from './iMacFrame.module.scss';
import VaryaImage from '../../../assets/svg/landingScreen/Varya.svg';
import BgLayerImage from '../../../assets/svg/landingScreen/Blue.svg';

const iMacFrame = forwardRef((props, ref) => {
	return (
		<div ref={ref} className={s.imacFrame}>
			<div className={s.screen}>
				<div className={s.screenContent}>
					<img
						src={VaryaImage}
						alt="Varya"
						className={s.screenImage}
						data-image="varya"
					/>
					<img
						src={BgLayerImage}
						alt="VE Dashboard"
						className={s.screenImage}
						data-image="bg-layer"
					/>
				</div>
			</div>
			<div className={s.lens}>
				<div className={s.lensOuter}></div>
				<div className={s.lensInner}>
					<div className={s.lensReflection1}></div>
					<div className={s.lensReflection2}></div>
					<div className={s.lensReflection3}></div>
					<div className={s.lensReflection4}></div>
					<div className={s.lensReflection5}></div>
				</div>
			</div>
			<div className={s.textContainer}>
				{/* VE text overlay */}
				<div className={s.veText} data-ve-text="true">
					Hey, I'm VE — the living mind of your company.
				</div>
				{/* Additional description text */}
				<div className={s.descriptionText} data-description-text="true">
					I see your work across every integration, I remember everything, and I act
					before you ask. I keep a long-term evolving memory, read signals in real time,
					connect the dots, and align everything to your goals.
				</div>
				{/* Second description text */}
				<div className={s.descriptionText2} data-description-text-2="true">
					I plan the next moves, execute the heavy lifting, and get work done with your
					safe approvals. But I am more than assistance. I am Operating Intelligence the
					company brain that never sleeps. I run across your desktop, your meetings, and
					your workflows. I draft, schedule, follow up, and resolve blockers while you
					focus on vision.
				</div>
			</div>
		</div>
	);
});

iMacFrame.displayName = 'iMacFrame';

export default memo(iMacFrame);
