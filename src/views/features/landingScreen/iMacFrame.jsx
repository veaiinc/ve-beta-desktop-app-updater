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
		</div>
	);
});

iMacFrame.displayName = 'iMacFrame';

export default memo(iMacFrame);
