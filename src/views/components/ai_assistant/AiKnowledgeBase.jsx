import React, { memo, useState } from 'react';
import '../../../assets/scss/ai_assistant/knowledgeBase.scss';
import { ReactComponent as Link } from '../../../assets/svg/smartFiles/formResponse/link.svg';
import AddKnowledgeModal from '../../components/modalsV2/settings/ai_setup/AddKnowledgeModal';

const AiKnowledgeBase = () => {
	const [info, setInfo] = useState({
		toggleStates: {},
		knowledgeModalOpen: false,
	});

	const handleToggleChange = (toggleId) => {
		setInfo((prev) => ({
			...prev,
			toggleStates: {
				...prev.toggleStates,
				[toggleId]: !prev.toggleStates[toggleId],
			},
		}));
	};

	const knowledgeBaseItems = [
		{ id: 'kb_1', title: 'Speak about customer', lastEdit: 'Jul, 26 2024' },
		{ id: 'kb_2', title: 'Speak about customer', lastEdit: 'Jul, 26 2024' },
		{ id: 'kb_3', title: 'Speak about customer', lastEdit: 'Jul, 26 2024' },
		{ id: 'kb_4', title: 'Speak about customer', lastEdit: 'Jul, 26 2024' },
		{ id: 'kb_5', title: 'Speak about customer', lastEdit: 'Jul, 26 2024' },
		{ id: 'kb_6', title: 'Speak about customer', lastEdit: 'Jul, 26 2024' },
	];

	return (
		<>
			<div className="aiKnowledgeBaseParentContainer">
				<div className="knowledgeBaseHeaderContainer">
					<div className="knowledgeBaseHeader">
						<span className="lineone">Knowledge Base</span>
						<span className="linetwo">
							Make files available to this AI assistant so it can use them as a source
							of knowledge for chats.
						</span>
					</div>

					<div
						className="addKnowledge"
						onClick={() => setInfo((prev) => ({ ...prev, knowledgeModalOpen: true }))}
					>
						Add a Knowledge
					</div>
				</div>

				<div className="knowledgeBaseListContainer">
					<div className="header">
						<span>Title</span>
						<span>Last edit</span>
						<span>Active</span>
					</div>
					{knowledgeBaseItems?.map((item) => (
						<div key={item?.id} className="knowledgeBaseItem">
							<span>
								<Link />
								{item?.title}
							</span>
							<span style={{ color: '#7C7C84' }}>{item?.lastEdit}</span>
							<span className="toggleSwitch">
								<input
									type="checkbox"
									id={item?.id}
									className="toggle"
									checked={info?.toggleStates[item?.id] || false}
									onChange={() => handleToggleChange(item.id)}
								/>
								<label htmlFor={item?.id}></label>
							</span>
						</div>
					))}
				</div>
			</div>
			<AddKnowledgeModal
				isOpen={info?.knowledgeModalOpen}
				toggleModal={() => {
					setInfo((prev) => ({ ...prev, knowledgeModalOpen: false }));
				}}
				onActionClick={() => {}}
			/>
		</>
	);
};

export default memo(AiKnowledgeBase);
