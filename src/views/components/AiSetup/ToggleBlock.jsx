import React, { useState } from 'react';
import '../../../assets/scss/AiSetup/toggleBlock.scss';
import { ReactComponent as Plus } from '../../../assets/svg/ai_assistant/plus.svg';

const ToggleBlock = ({ title, description }) => {
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
					{title}
				</h1>
				<button
					onClick={() => updateInfo({ isOpen: !info.isOpen })}
					className="toggleBlockHeaderButton"
				>
					<Plus style={{ transform: info.isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }} />
				</button>
			</div>
			{info.isOpen && (
				<div className="toggleBlockContent">
					{
						'ghjgsdjfg dshjgf sdgfhjsdgf sdgfjhgsdjh fhjsdgf ghjsdg fhjds gfhgsd fsdghjfg hjsdgfjds fgds f sdgfhsdg fgsdhj fsgdf hjdsgfh sdghf gsd fghjsdgf sdjhgfsd gfhjsd fgjhsdg jh'
					}
				</div>
			)}
		</div>
	);
};

export default ToggleBlock;
