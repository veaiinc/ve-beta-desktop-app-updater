import { memo } from 'react';
import s from './intro.module.scss';

const Intro = memo(function Intro() {
	return (
		<div className={s.Intro}>
			<div className={s.content}>
				<h1 className={s.title}>Ambient Intelligence</h1>
				<p className={s.subHead}>
					Not background noise. Pure signal. <br /> It senses context before you ask.
				</p>
			</div>
		</div>
	);
});

export default memo(Intro);
