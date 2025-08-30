// import Spinner from '../loaders/Spinner';
import VeLoader from '../loaders/VeLoader';

const SuspenseFallback = () => {
	return (
		<div
			style={{
				width: '100vw',
				height: '100vh',
				background: 'inherit',
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
