import { memo, forwardRef } from 'react';
import s from './fullscreenIMac.module.scss';
import BgLayerImage from '../../../assets/images/landingScreen/BgLayer.png';

const FullscreenIMac = forwardRef((props, ref) => {
	return (
		<div ref={ref} className={s.fullscreenIMac}>
			<img src={BgLayerImage} alt="VE Dashboard" className={s.fullscreenImage} />
		</div>
	);
});

FullscreenIMac.displayName = 'FullscreenIMac';

export default memo(FullscreenIMac);
