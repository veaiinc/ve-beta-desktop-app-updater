// import Spinner from '../loaders/Spinner';
import VeLoader from '../loaders/VeLoader';
import useTheme from '../../../hooks/useTheme';
const SuspenseFallback = () => {
	useTheme();

	return (
		<div
			style={{
				width: '100vw',
				height: '100vh',
				background: 'var(--background-color)',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			{/* <Spinner
				width="32px"
				height="32px"
				color="var(--primary-button)"
				borderTopColor="var(--background-color)"
				borderWidth="1.5"
			/> */}
			<VeLoader />
		</div>
	);
};

export default SuspenseFallback;
