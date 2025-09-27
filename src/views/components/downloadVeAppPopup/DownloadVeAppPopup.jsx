import { Link } from 'react-router-dom';
import s from './downloadVeAppPopup.module.scss';
import ReactModal from '../modalsV2';

// icons
import { ReactComponent as TickIcon } from './assets/tick.svg';
import { ReactComponent as CrossIcon } from './assets/cross.svg';
import { ReactComponent as Step1Icon } from './assets/step1.svg';
import { ReactComponent as Step2Icon } from './assets/step2.svg';
import { ReactComponent as Step3Icon } from './assets/step3.svg';

// images
import step1Preview from './assets/step1Preview.png';
import step2Preview from './assets/step2Preview.png';
import step3Preview from './assets/step3Preview.png';

// constants
const customStyles = {
	content: {
		width: '1055px',
		height: '469px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	overlay: {
		backdropFilter: 'blur(8px)',
		zIndex: 1,
	},
};
const steps = [
	{
		id: 1,
		description: (
			<p>
				Open <a>Ve.dmg</a> from your <a>Download</a> folder
			</p>
		),
		previewImg: step1Preview,
		stepNumberIcon: <Step1Icon />,
	},
	{
		id: 2,
		description: (
			<p>
				Drag the <a>Ve icon</a> into your <a>Applications</a> folder
			</p>
		),
		previewImg: step2Preview,
		stepNumberIcon: <Step2Icon />,
	},
	{
		id: 3,
		description: (
			<p>
				Open the <a>Ve app</a> from your <a>Application</a> folder
			</p>
		),
		previewImg: step3Preview,
		stepNumberIcon: <Step3Icon />,
	},
];

const DownloadVeAppPopup = ({ isOpen, closeModal, downloadUrl }) => {
	return (
		<ReactModal isOpen={isOpen} closeModal={closeModal} customStyles={customStyles}>
			<div className={s.container}>
				<div className={s.heading}>
					<TickIcon className={s.tickIcon} />
					<h1 className={s.headingTitle}>Downloaded</h1>
				</div>
				<CrossIcon className={s.crossIcon} onClick={closeModal} />
				<h1 className={s.title}>How to Install Ve</h1>
				<div className={s.stepsContainer}>
					{steps.map((step) => (
						<div className={s.stepContainer} key={step.id}>
							<div className={s.stepNumber}>{step.id}</div>
							<img
								src={step.previewImg}
								alt={step.description}
								className={s.previewImg}
								data-step-number={step.id}
							/>
							<div className={s.description}>{step.description}</div>
						</div>
					))}
				</div>
				<p className={s.downloadAgainLink}>
					Problem? <Link to={downloadUrl}>Download again</Link>
				</p>
			</div>
		</ReactModal>
	);
};

export default DownloadVeAppPopup;
