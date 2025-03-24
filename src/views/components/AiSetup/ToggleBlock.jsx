import React, { useState, memo } from 'react';
import '../../../assets/scss/AiSetup/toggleBlock.scss';
import { ReactComponent as Plus } from '../../../assets/svg/ai_assistant/plus.svg';

const ToggleBlock = ({ heading, description }) => {
	const [info, setInfo] = useState({
		isOpen: false,
	});

	const updateInfo = (data) => {
		setInfo((prev) => ({ ...prev, ...data }));
	};

	return (
		<div className={`toggleBlockContainer ${info.isOpen ? 'toggleBlockContainerOpen' : ''}`}>
			<div className="toggleBlockHeader">
				<h1
					className={
						info.isOpen ? 'toggleBlockHeaderTitleOpen' : 'toggleBlockHeaderTitle'
					}
				>
					{heading}
				</h1>
				<button
					onClick={() => updateInfo({ isOpen: !info.isOpen })}
					className="toggleBlockHeaderButton"
				>
					<Plus style={{ transform: info.isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }} />
				</button>
			</div>
			{info.isOpen && <div className="toggleBlockContent">{description}</div>}
		</div>
	);
};

export default memo(ToggleBlock);
