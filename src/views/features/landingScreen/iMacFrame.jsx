import { memo, forwardRef } from 'react';
import s from './iMacFrame.module.scss';
import BgLayerImage from '../../../assets/images/landingScreen/BgLayer.png';

const iMacFrame = forwardRef((props, ref) => {
	return (
		<div ref={ref} className={s.imacFrame}>
			<div className={s.screen}>
				<div className={s.screenContent}>
					<img src={BgLayerImage} alt="VE Dashboard" className={s.screenImage} />
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
			<div className={s.border}></div>
			{/* VE text overlay */}
			<div className={s.veText} data-ve-text="true">
				Hey, I'm VE — the living mind of your company.
			</div>
			{/* Additional description text */}
			<div className={s.descriptionText} data-description-text="true">
				I see your work across every integration, I remember everything, and I act before you ask. I keep a long-term evolving memory, read signals in real time, connect the dots, and align everything to your goals.
			</div>
		</div>
	);
});

iMacFrame.displayName = 'iMacFrame';

export default memo(iMacFrame);
