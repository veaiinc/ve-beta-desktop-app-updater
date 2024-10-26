import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import ReactModal from '../../modalsV2/index';
import '../../../../assets/scss/gallery/modals/collaboratorPopup.scss';
import ToggleSlider from '../../input/slider';
import { ReactComponent as DeleteLogo } from '../../../../assets/svg/gallery/delete.svg';
import { ReactComponent as SearchLogo } from '../../../../assets/svg/chat/search.svg';
import Context from '../../../../context/context';
import { Tooltip } from 'antd';
import { getInitials } from '../../../../helpers/index';

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
const imageURL = 'https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg';
const CollaboratorPopup = ({ open, closeModal, galleryId, setCollaborator }) => {
	const {
		companyInfo: { getTeamMembers, tenantsUserList },
		galleryInfo: {
			getCollaborators,
			postCollaborators,
			collaborators,
			updateCollaborators,
			deleteCollaborators,
		},
	} = useContext(Context);
	const [collaboratorInfo, setCollaboratorInfo] = useState({
		searchTerm: '',
		showAllUsers: false,
		data: collaborators,
	});
	useEffect(() => {
		if (!tenantsUserList) {
			getTeamMembers();
		}
	}, [tenantsUserList]);
	useEffect(() => {
		if (!collaborators) {
			getCollaborators(galleryId);
		}
		if (collaborators) {
			setCollaboratorInfo((prev) => ({
				...prev,
				data: collaborators,
			}));
		}
	}, [collaborators]);
	const handleSearchChange = (e) => {
		setCollaboratorInfo((prev) => ({
			...prev,
			searchTerm: e.target.value,
		}));
	};
	const handleShowAllUsers = () => {
		setCollaboratorInfo((prev) => ({
			...prev,
			showAllUsers: !prev?.showAllUsers,
		}));
	};
	const handleAddCollaborator = (userData) => {
		const updateData = [...collaboratorInfo.data, { ...userData, canDownload: false }];
		setCollaboratorInfo((prev) => ({
			...prev,
			showAllUsers: !prev?.showAllUsers,
			data: updateData,
		}));
		setCollaborator(updateData);
		const payload = {
			_id: userData._id,
			role: ['collaborator'],
		};
		postCollaborators(payload, galleryId);
	};
	const handleCollaboratorChange = useCallback((value, id) => {
		const payload = {
			canDownload: value,
		};
		updateCollaborators(payload, galleryId, id);
	}, []);
	const handleCollaboratorDelete = (id) => {
		const updatedData = collaboratorInfo?.data.filter(
			(collaborator) => collaborator?._id !== id,
		);
		setCollaboratorInfo((prev) => ({
			...prev,
			data: updatedData,
		}));
		setCollaborator(updatedData);
		deleteCollaborators(galleryId, id);
	};

	return (
		<ReactModal isOpen={open} closeModal={closeModal}>
			<div className="collaborator-main">
				<div className="collaborator-title">
					<p>Manage collaborators</p>
					<p style={{ cursor: 'pointer' }} onClick={closeModal}>
						X
					</p>
				</div>
				<div className="collaborator-wrapper">
					<div>
						<Tooltip
							placement="bottomLeft"
							title={
								<div className="tenantUsers">
									{tenantsUserList?.map((user, index) => (
										<div
											key={index}
											className="tenantData"
											onClick={() => handleAddCollaborator(user)}
										>
											<div className="tenantLogo">
												{/* <img src={user.imageUrl || imageURL} alt={user.name} /> */}
												<p>
													{getInitials(user?.firstName, user?.lastName)}
												</p>
											</div>
											<p>{user.firstName}</p>
										</div>
									))}
								</div>
							}
							color={'transparent'}
							arrow={false}
							trigger="click"
							overlayClassName="toolTipContainer"
							open={collaboratorInfo?.showAllUsers}
							onOpenChange={(open) => {
								if (!open) {
									handleShowAllUsers();
								}
							}}
							className="search-container "
						>
							<SearchLogo />
							<input
								placeholder="Search people"
								onClick={handleShowAllUsers}
								onChange={handleSearchChange}
								value={collaboratorInfo.searchTerm}
							/>
						</Tooltip>
						{console.log(tenantsUserList, 'tenantsUserList')}
						{/* {collaboratorInfo?.showAllUsers && (
							<div className="tenantUsers">
								{tenantsUserList?.map((user, index) => (
									<div
										key={index}
										className="tenantData"
										onClick={() => hanldeAddCollaborator(user)}
									>
										<img src={user.imageUrl || imageURL} alt={user.name} />
										<p>{user.firstName}</p>
									</div>
								))}
							</div>
						)} */}
					</div>
					{collaboratorInfo?.data?.map((ele, index) => (
						<div key={index} className="collaborators">
							<div className="collaborator-name">
								<div className="tenantLogo">
									<p>{getInitials(ele?.firstName, ele?.lastName)}</p>
									{/* <img src={imageURL} /> */}
								</div>

								<p>{ele.firstName}</p>
							</div>
							<div className="collaborator-settings">
								<p>canDownload</p>
								<ToggleSlider
									value={ele.canDownload}
									onChange={() =>
										handleCollaboratorChange(!ele?.canDownload, ele?._id)
									}
								/>
								<div onClick={() => handleCollaboratorDelete(ele?._id)}>
									<DeleteLogo className="deleteLogo" />
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(CollaboratorPopup);
