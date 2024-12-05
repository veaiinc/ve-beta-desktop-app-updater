import React, { memo, useState } from 'react';
import ReactModal from '../index';
import '../../../../assets/scss/tasks/modals/createTaskPopup.scss';
import { ReactComponent as ExpandIcon } from '../../../../assets/svg/gallery/expand.svg';
import { ReactComponent as CrossWhite } from '../../../../assets/svg/Settings/CrossWhite.svg';
import { ReactComponent as PaperClip } from '../../../../assets/svg/tasks/paperClip.svg';
import { ReactComponent as ParellalLines } from '../../../../assets/svg/tasks/parallelLines.svg';
import { ReactComponent as CircleHollow } from '../../../../assets/svg/tasks/circleHollowThin.svg';
import { ReactComponent as Cube } from '../../../../assets/svg/tasks/cube.svg';
import Priority from '../../tasks/listView/Priority';
import DropDown from '../../dropDown/tasks/DropDown';

const CreateTaskPopup = () => {
	const [info, setInfo] = useState({
		isModalOpen: false,
	});

	const updateModalInfo = (key, value) => {
		setInfo((prevInfo) => ({ ...prevInfo, key: value }));
	};

	return (
		<ReactModal
			isOpen={info?.isModalOpen}
			closeModal={() => updateModalInfo('isModalOpen', false)}
			modalType={'center'}
		>
			<div className="createTask-container">
				<div className="header-wrapper">
					<div className="logo"></div>
					<div className="actions-wrapper">
						<ExpandIcon className="expandsvg" />
						<CrossWhite className="crossSvg" />
					</div>
				</div>
				<div className="text-wrapper">
					<input type="text" placeholder="Task title" />
					<textarea name="" id="" placeholder="Add description..."></textarea>
				</div>
				<div className="properties-wrapper">
					<DropDown>
						<div className="property">
							<Cube />
							<span className="label">Project hunt</span>
						</div>
					</DropDown>
					<DropDown>
						<div className="property">
							<CircleHollow />
							<span className="label">Todo</span>
						</div>
					</DropDown>
					<DropDown>
						<div className="property">
							<ParellalLines />
							<span className="label">Priority</span>
						</div>
					</DropDown>

					<div className="property">
						<ParellalLines />
						<span className="label">Priority</span>
					</div>
				</div>
				<div className="footer-wrapper">
					<PaperClip />
					<button className="btn-createIssue">Create issue</button>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(CreateTaskPopup);
