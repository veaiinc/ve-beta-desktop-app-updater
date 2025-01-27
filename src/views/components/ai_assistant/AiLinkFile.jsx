import React, { memo, useState } from 'react';
import '../../../assets/scss/ai_assistant/aiLinkFile.scss';
import { ReactComponent as Link } from '../../../assets/svg/smartFiles/formResponse/link.svg';

const AiLinkFile = () => {
	const [toggleStates, setToggleStates] = useState({});

	const handleToggleChange = (toggleId) => {
		setToggleStates((prevStates) => ({
			...prevStates,
			[toggleId]: !prevStates[toggleId],
		}));
	};

	const linkFileItems = [
		{ id: 'lf_1', title: 'Wedding workflow 1', lastEdit: 'Jul, 26 2024' },
		{ id: 'lf_2', title: 'Wedding workflow 2', lastEdit: 'Jul, 26 2024' },
	];

	return (
		<div className="aiLinkFileParentContainer">
			<div className="aiLinkFileHeaderContainer">
				<div className="aiLinkFileHeader">
					<span className="lineone">Assisting to</span>
					<span className="linetwo">
						Link files to this AI assistant, allowing the user to interact through chat
						in file.
					</span>
				</div>

				<div className="addLinkFile">Link file</div>
			</div>

			<div className="aiLinkFileListContainer">
				<div className="header">
					<span>Title</span>
					<span>Last edit</span>
					<span>Active</span>
				</div>
				{linkFileItems?.map((item) => (
					<div key={item?.id} className="actionItem">
						<span>
							{/* <Link /> */}
							{item?.title}
						</span>
						<span style={{ color: '#7C7C84' }}>{item?.lastEdit}</span>
						<span className="toggleSwitch">
							<input
								type="checkbox"
								id={item?.id}
								className="toggle"
								checked={toggleStates[item?.id] || false}
								onChange={() => handleToggleChange(item.id)}
							/>
							<label htmlFor={item?.id}></label>
						</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(AiLinkFile);
