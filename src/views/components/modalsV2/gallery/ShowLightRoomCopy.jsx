import ReactModal from '../index';
import React from 'react';
import { ReactComponent as CrossSvg } from '../../../../assets/svg/gallery/cross.svg';
const ShowLightRoomCopy = (props) => {
	const { open, onClose, lightroomCopyList, onCopyList } = props;
	return (
		<ReactModal isOpen={open} closeModal={onClose} modalType={'center'}>
			<div className="lightRoomCopyContainer">
				<div className="lightRoomCopyContent">
					<div className="lightRoomCopyHeading">
						<div className="lightRoomCopyHeadingText">Light Room Copy List</div>
						<div
							className="lightRoomCopyCloseButton"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								onClose();
							}}
							style={{ cursor: 'pointer' }}
						>
							<CrossSvg />
						</div>
					</div>
					<div className="lightRoomCopySubHeading">
						Quickly find favourite images in Lightroom. Copy and paste filenames into
						Lightroom Library search.
					</div>
				</div>
				<div className="lightRoomCopyListContainer">
					{lightroomCopyList?.map((item, index) => (
						<p key={index} style={{ fontSize: '14px', color: '#939393' }}>
							<b>({index + 1}).</b> {item}
							{index !== lightroomCopyList?.length - 1 ? ',' : ''}
						</p>
					))}
				</div>
				<div style={{ alignSelf: 'flex-end' }}>
					<button
						className="lightRoomCopyListButton"
						onClick={onCopyList}
						style={{ cursor: 'pointer' }}
					>
						Copy List
					</button>
				</div>
			</div>
		</ReactModal>
	);
};
export default ShowLightRoomCopy;
