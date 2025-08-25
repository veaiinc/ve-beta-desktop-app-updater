import s from './pageLoader.module.scss';
import Spinner from '../../components/loaders/Spinner';
import useTheme from '../../../hooks/useTheme';
import logout from '../../../helpers/logout';
import { useEffect } from 'react';

const PageLoader = ({ customStyles }) => {
	useTheme();
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			logout();
		}, 60000);
		return () => clearTimeout(timeoutId);
	}, []);
	return (
		<div className={s.loaderContainer} style={customStyles}>
			<Spinner
				width="32px"
				height="32px"
				color="var(--primary-button)"
				borderTopColor="var(--background-color)"
				borderWidth="1.5"
			/>
		</div>
	);
};

export default PageLoader;
