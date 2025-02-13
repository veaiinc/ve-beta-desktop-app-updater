import React from 'react';
import { ReactComponent as FullscreenSvg } from '../../../../assets/svg/notes/fullScreen.svg';
import '../../../../assets/scss/notes/doucmentPreview.scss';
import NoteComponent from '../../notes/NoteComponent';
const DocumentPreview = ({ content, title, onClick }) => {
	return (
		<div className="preview-container">
			<div className="header">
				<div className="title">{title}</div>
				<div className="fill-screen-icon-container" onClick={onClick}>
					<FullscreenSvg />
				</div>
			</div>
			<NoteComponent
				content={content}
				editable={false}
				outerContainerStyle={{
					width: '100%',
					height: '280px',
					borderRadius: '16px',
					padding: 0,
				}}
				innerContainerStyle={{
					width: '100%',
					height: '280px',
					borderRadius: '16px',
				}}
			/>
		</div>
	);
};

export default DocumentPreview;
