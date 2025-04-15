import React, { useState, memo, useEffect, useCallback, useContext } from 'react';
import ReactModal from '../modalsV2';
import { ReactComponent as CrossSvg } from '../../../assets/svg/gallery/cross.svg';
import '../../../assets/scss/home_page/promptPopup.scss';
import Context from '../../../context/context';
import { useNavigate } from 'react-router-dom';
import ObjectID from 'bson-objectid';

const PromptPopup = ({ open, closeModal, selectedCard }) => {
	const {
		templates: { updateStateValues },
	} = useContext(Context);

	const [searchText, setSearchText] = useState('');
	const [selectedOptions, setSelectedOptions] = useState({});
	const [isOpen, setIsOpen] = useState(false);
	const [clientSearch, setClientSearch] = useState('');
	const [dynamicPrompt, setDynamicPrompt] = useState(selectedCard?.prompt || '');
	const navigate = useNavigate();

	const selectedCardVariables = selectedCard?.variables;

	useEffect(() => {
		setDynamicPrompt(selectedCard?.prompt || '');
	}, [selectedCard]);

	const handleSelectedFile = (file) => {
		setSelectedOptions((prev) => {
			const cardId = selectedCard?.id;
			if (!cardId) return prev;

			const isSelected = prev?.[cardId]?.includes(file);
			const updatedFiles = isSelected
				? prev[cardId]?.filter((f) => f !== file)
				: [...(prev[cardId] || []), file];

			return {
				...prev,
				[cardId]: updatedFiles.length > 0 ? updatedFiles : undefined,
			};
		});
	};

	const handleClientSearch = (value) => {
		setClientSearch(value?.title);
	};

	const handleRemoveSelectedFile = (file) => {
		setSelectedOptions((prev) => {
			const cardId = selectedCard?.id;

			if (!cardId) return prev;
			const updatedOptions = {
				...prev,
				[cardId]: (prev[cardId] || [])?.filter((f) => f !== file),
			};

			if (updatedOptions?.[cardId]?.length === 0) {
				delete updatedOptions?.[cardId];
			}

			return updatedOptions;
		});
	};

	const handleClickRun = useCallback(() => {
		updateStateValues({ activePromptForChat: dynamicPrompt });
		closeModal();
		navigate(`/chat/${ObjectID().toString()}`);
	}, [dynamicPrompt]);

	return (
		<ReactModal isOpen={open} closeModal={closeModal} modalType={'center'}>
			<div className="promptPopupContainer">
				<div className="promptPopupContainerHeader">
					<div className="promptPopupContainerHeaderLeft">
						<div className="promptPopupContainerHeaderLeftTitle">
							{selectedCard?.title}
						</div>
						<div className="promptPopupContainerHeaderLeftSubtitle">20 Credits</div>
					</div>
					<div className="promptPopupContainerHeaderRight" onClick={closeModal}>
						<CrossSvg />
					</div>
				</div>

				<div className="promptPopupContainerBody">
					<textarea
						value={dynamicPrompt}
						onChange={(e) => setDynamicPrompt(e?.target?.value)}
						className="promptPopupContainerBodyText"
						rows={2}
						style={{ resize: 'none' }}
					/>
				</div>

				{selectedOptions?.[selectedCard?.id]?.length && (
					<div className="promptPopupContainerSelectedFilesDiv">
						{selectedOptions?.[selectedCard?.id]?.map((file, index) => {
							return (
								<div className="promptPopupContainerEachSelectedFile">
									<div className="promptPopupContainerEachSelectedFileText">
										{file}
									</div>
									<CrossSvg
										onClick={() => handleRemoveSelectedFile(file)}
										style={{ cursor: 'pointer' }}
									/>
								</div>
							);
						})}
					</div>
				)}

				{/* <div className="promptPopupContainerFilesDiv">
					<div className="promptPopupContainerSelectionFiles">
						<div className="promptPopupContainerSelectionFilesTitle">Select file</div>
						<div className="promptPopupContainerSelectionFilesSearch">
							<SearchIcon />
							<input
								type="text"
								placeholder="Search Files"
								className="inputSearchText"
								value={searchText}
								onChange={(e) => setSearchText(e?.target?.value)}
							/>
						</div>
					</div>
					<div className="promptPopupOptionsContainer">
						{files?.map((file, index) => {
							return (
								<div
									key={index}
									className={`promptPopupOptionsContainerFiles ${
										selectedOptions?.[selectedCard?.id]?.includes(file)
											? 'selected'
											: ''
									}`}
									onClick={() => handleSelectedFile(file)}
									style={{ cursor: 'pointer' }}
								>
									<div className="promptPopupContainerFilesList">
										<div className="promptPopupContainerFilesListFileIcon"></div>
										<div className="promptPopupContainerFilesListFile">
											{file}
										</div>
									</div>
									{selectedOptions?.[selectedCard?.id]?.includes(file) && (
										<div className="promptPopupContainerFilesListSelected">
											<TickSvg />
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div> */}
				<button className="promptPopupContainerRunButton" onClick={handleClickRun}>
					Run
				</button>
			</div>
		</ReactModal>
	);
};

export default memo(PromptPopup);
