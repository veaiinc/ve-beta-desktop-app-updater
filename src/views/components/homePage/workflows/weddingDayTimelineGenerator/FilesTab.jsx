import React from 'react';
import { ReactComponent as ChevronRightThinIcon } from '../../../../../assets/svg/tasks/chevronRightThin.svg';

const FilesTab = ({ labels, title }) => {
	return (
		<div className="files-container">
			<div className="file">
				<div className="left"></div>

				<div className="right-text">
					<div className="title">{title} </div>
					<div className="labels">
						{labels.map((label, index) => {
							if (index === 0) {
								return <div>{label} </div>;
							}
							return (
								<>
									<ChevronRightThinIcon />
									<div>{label}</div>
								</>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default FilesTab;
