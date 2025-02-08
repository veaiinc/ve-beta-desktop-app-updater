import { Drawer } from 'antd';
import React from 'react';
import '../../../assets/scss/notes/noteComponentModal.scss';
import NoteComponent from './NoteComponent';

const NoteComponentModal = ({ modalIsOpen, closeModal }) => {
	return (
		<Drawer
			open={modalIsOpen}
			onClose={closeModal}
			placement="right"
			rootClassName="container"
			width={'100vw'}
		>
			<div className="container">
				<NoteComponent
					outerContainerStyle={{ width: '80%', height: '80%', borderRadius: '0.75rem' }}
				/>
			</div>
		</Drawer>
	);
};

export default NoteComponentModal;
