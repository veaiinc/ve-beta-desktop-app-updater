import { memo, forwardRef } from 'react';
import s from './fullscreenIMac.module.scss';

const FullscreenIMac = forwardRef((props, ref) => {
	return <div ref={ref} className={s.fullscreenIMac} aria-hidden={true}></div>;
});

FullscreenIMac.displayName = 'FullscreenIMac';

export default memo(FullscreenIMac);
