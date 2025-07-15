import { useState, memo, useMemo } from 'react';
import './guideMePopup.scss';
import ReactModal from '../../components/modalsV2';
import GuideMePreference from './guideMePreference';
import GuideMeAgenda from './guideMeAgenda';
import GuideMeKnowledge from './guideMeKnowledge';

const selectableOptions = [
	{ id: 1, title: 'Preference', value: 'preference' },
	{ id: 2, title: 'Agenda', value: 'agenda' },
	{ id: 3, title: 'Knowledge base', value: 'knowledgeBase' },
];
const GuideMePopup = ({ isOpen, onClose }) => {
	const [info, setInfo] = useState({
		mode: 'Sales Mode',
		selectedOption: 'preference',
	});

	const Component = useMemo(() => {
		switch (info.selectedOption) {
			case 'preference':
				return <GuideMePreference />;
			case 'agenda':
				return <GuideMeAgenda />;
			case 'knowledgeBase':
				return <GuideMeKnowledge />;
			default:
				return null;
		}
	}, [info.selectedOption]);
	return (
		<ReactModal isOpen={isOpen} onClose={onClose}>
			<div className="guideMePopupMainContainer">
				<div className="guideMePopupMainContainerHeader">
					<button
						className={`guideMePopupMainContainerHeaderButton${
							info.mode === 'Sales Mode' ? ' active' : ''
						}`}
						onClick={() => setInfo((prev) => ({ ...prev, mode: 'Sales Mode' }))}
					>
						Sales Mode
					</button>
					<button
						className={`guideMePopupMainContainerHeaderButton${
							info.mode === 'Support' ? ' active' : ''
						}`}
						onClick={() => setInfo((prev) => ({ ...prev, mode: 'Support' }))}
					>
						Support
					</button>
					<button
						className={`guideMePopupMainContainerHeaderButton${
							info.mode === 'Interviewer' ? ' active' : ''
						}`}
						onClick={() => setInfo((prev) => ({ ...prev, mode: 'Interviewer' }))}
					>
						Interviewer
					</button>
					<button
						className={`guideMePopupMainContainerHeaderButton${
							info.mode === 'Ideas' ? ' active' : ''
						}`}
						onClick={() => setInfo((prev) => ({ ...prev, mode: 'Ideas' }))}
					>
						Ideas
					</button>
				</div>
				<div className="guideMePopupMainContainerBody">
					<div className="guideMeOptionsContainer">
						{selectableOptions.map((item) => (
							<div
								key={item.id}
								className={`guideMeOptionsContainerButton${
									info.selectedOption === item.value ? ' active' : ''
								}`}
								onClick={() =>
									setInfo((prev) => ({ ...prev, selectedOption: item.value }))
								}
							>
								{item.title}
							</div>
						))}
					</div>
					<div className="guideMePopupMainContainerBodyComponent">{Component}</div>
				</div>
				<div className="guideMePopupMainContainerFooter">
					<button className="guideMePopupButton">
						{' '}
						{`Go With ${info?.mode === 'Sales Mode' ? 'Sales' : info?.mode} Mode`}
					</button>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(GuideMePopup);
