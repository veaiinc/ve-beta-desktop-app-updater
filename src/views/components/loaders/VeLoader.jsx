import { useEffect } from 'react';
import s from './veloader.module.scss';
import useWindowSize from '../../../hooks/useWindowSize';
import logout from '../../../helpers/logout';
import useTheme from '../../../hooks/useTheme';

const VeLoader = ({ size = null }) => {
	const { width } = useWindowSize();
	let theme = useTheme();

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			logout();
		}, 60000);
		return () => clearTimeout(timeoutId);
	}, []);

	useEffect(() => {
		const spinnerBgColor = !theme || theme === 'dark' ? '#121212' : '#ffffff';

		document.documentElement.style.setProperty('--spinner-bg-color', spinnerBgColor);
	}, [theme]);

	const contentStyle = {
		padding: 30,
	};

	return (
		<div className={s.spinnerWrapper}>
			<div className={s.spinnerContainer}>
				<div className={`${s.spinner} ${s[size ? size : width > 768 ? 'large' : 'small']}`}>
					<div className={s.content} style={contentStyle}></div>
					<div className={s.dots}>
						<div className={`${s.dot} ${s.dot1}`}></div>
						<div className={`${s.dot} ${s.dot2}`}></div>
						<div className={`${s.dot} ${s.dot3}`}></div>
						<div className={`${s.dot} ${s.dot4}`}></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default VeLoader;
