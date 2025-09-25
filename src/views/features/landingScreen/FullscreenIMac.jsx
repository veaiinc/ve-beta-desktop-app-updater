import { memo, forwardRef } from 'react';
import s from './fullscreenIMac.module.scss';

const FullscreenIMac = forwardRef((props, ref) => {
	return <div ref={ref} className={s.fullscreenIMac}></div>;
});

FullscreenIMac.displayName = 'FullscreenIMac';

export default memo(FullscreenIMac);
