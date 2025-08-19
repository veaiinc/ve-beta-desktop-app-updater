import s from './pageLoader.module.scss';
import Spinner from '../../components/loaders/Spinner';
import useTheme from '../../../hooks/useTheme';

const PageLoader = ({ customStyles }) => {
	useTheme();
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
