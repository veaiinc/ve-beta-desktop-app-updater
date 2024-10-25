import React, { memo } from 'react';
import ReactModal from '../../modalsV2/index';

import '../../../../assets/scss/gallery/modals/collaboratorPopup.scss';
import ToggleSlider from '../../input/slider';
import { ReactComponent as DeleteLogo } from '../../../../assets/svg/gallery/delete.svg';

const collaborators = [
	{ name: 'Alice Johnson', canDownload: true },
	{ name: 'Bob Smith', canDownload: false },
	{ name: 'Charlie Brown', canDownload: true },
	{ name: 'Diana Ross', canDownload: false },
	{ name: 'Ethan Hunt', canDownload: true },
	{ name: 'Fiona Apple', canDownload: false },
	{ name: 'George Michael', canDownload: true },
	{ name: 'Hannah Montana', canDownload: false },
	{ name: 'Ian McKellen', canDownload: true },
	{ name: 'Julia Roberts', canDownload: false },
];

const CollaboratorPopup = ({ open, closeModal }) => {
	return (
		<ReactModal isOpen={open} closeModal={closeModal}>
			<div className="collaborator-main">
				<div>
					<p>Manage collaborators</p>
					<p>X</p>
				</div>
				<div>
					<div>
						<img />
						<input placeholder="Search people" />
					</div>
					{collaborators?.map((ele, index) => (
						<div key={index}>
							<div>
								<img />
								<p>{ele.name}</p>
							</div>
							<div>
								<p>canDownload</p>
								<ToggleSlider value={ele.canDownload} />
								<DeleteLogo />
							</div>
						</div>
					))}
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(CollaboratorPopup);
