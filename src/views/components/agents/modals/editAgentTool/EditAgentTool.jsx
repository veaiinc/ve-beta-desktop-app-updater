import { memo, useState } from 'react';
import s from './EditAgentTool.module.scss';
import ReactModal from '../../../modalsV2';
import { ReactComponent as SearchSvg } from '../../agentDetails/configureAgent/tabs/assets/search-icon.svg';
import { ReactComponent as TickSvg } from '../../../../../assets/svg/tick.svg';
import ToolInfo from '../../agentDetails/configureAgent/tabs/toolsTab/ToolInfo';

const EditAgentTool = ({ isOpen, onClose }) => {
	const [info, setInfo] = useState({
		addTool: true,
		selectedTool: null,
	});
	const handleAddTool = (tool) => {
		setInfo((prev) => ({ ...prev, addTool: true, selectedTool: tool }));
	};

	const handleBackButtonClick = () => {
		setInfo((prev) => ({ ...prev, addTool: false, selectedTool: null }));
	};
	return (
		<ReactModal
			isOpen={isOpen || true}
			closeModal={onClose}
			modalType={'center'}
			customStyles={{
				content: {
					zIndex: 1000,
				},
				overlay: {
					zIndex: 1001,
				},
			}}
		>
			<div className={s.editAgentToolContainer}>
				{info?.addTool ? (
					<ToolInfo onBackButtonClick={handleBackButtonClick} />
				) : (
					<>
						<div className={s.inputContainer}>
							<SearchSvg />
							<input
								type="text"
								className={s.inputField}
								placeholder="Browse tools"
							/>
						</div>
						<div className={s.toolsListContainer}>
							<div className={s.toolType}>Gmail</div>
							<div className={s.toolList}>
								<div className={s.toolItem}>
									<div className={s.itemIconContainer}></div>
									<div className={s.titleContainer}>
										<div className={s.title}>Gmail</div>
										<div className={s.addedContainer}>
											<TickSvg className={s.tickIcon} />
											<div className={s.addedText}>Added</div>
										</div>
									</div>
								</div>
								<div className={s.toolItem} onClick={() => handleAddTool()}>
									<div className={s.itemIconContainer}></div>
									<div className={s.titleContainer}>
										<div className={s.title}>
											Create Meet Event In Google Calendar
										</div>
										{/* <div className={s.addedContainer}>
									<TickSvg className={s.tickIcon} />
									<div className={s.addedText}>Added</div>
								</div> */}
									</div>
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</ReactModal>
	);
};

export default memo(EditAgentTool);
