import s from '../topNavbar.module.scss';

const DownCaret = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill=""
			className={s.downCaret}
		>
			<path
				d="M13 6L8 11L3 6"
				stroke="#F2F2F3"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default DownCaret;
