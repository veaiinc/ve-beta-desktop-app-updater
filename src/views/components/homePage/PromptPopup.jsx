import React, { useState, memo, useEffect, useCallback, useContext, useRef } from 'react';
import ReactModal from '../modalsV2';
import { ReactComponent as CrossSvg } from '../../../assets/svg/gallery/cross.svg';
import '../../../assets/scss/home_page/promptPopup.scss';
import Context from '../../../context/context';
import { useNavigate } from 'react-router-dom';
import ObjectID from 'bson-objectid';

const customStyles = {
	content: { zIndex: 99999 },
	overlay: { zIndex: 99998 },
};

const PromptPopup = ({ open, closeModal, selectedCard }) => {
	const {
		templates: { updateStateValues },
	} = useContext(Context);

	// const [searchText, setSearchText] = useState('');
	const [selectedOptions, setSelectedOptions] = useState({});
	const [isOpen, setIsOpen] = useState(false);
	const [clientSearch, setClientSearch] = useState('');
	const [dynamicValues, setDynamicValues] = useState({});
	const editableRef = useRef(null);
	const [parsedPrompt, setParsedPrompt] = useState([]);

	const navigate = useNavigate();

	useEffect(() => {
		if (!selectedCard?.prompt) return;

		const matches = [...selectedCard.prompt.matchAll(/\[([^\]]+)\]/g)];

		let lastIndex = 0;
		const parts = [];

		matches.forEach((match) => {
			const index = match.index;
			if (lastIndex < index) {
				parts.push({ type: 'text', value: selectedCard.prompt.slice(lastIndex, index) });
			}
			parts.push({ type: 'variable', value: match[1] });
			lastIndex = index + match[0].length;
		});

		if (lastIndex < selectedCard.prompt.length) {
			parts.push({ type: 'text', value: selectedCard.prompt.slice(lastIndex) });
		}

		setParsedPrompt(parts);

		// Initialize variable values
		const initialValues = {};
		matches.forEach((m) => (initialValues[m[1]] = ''));
		setDynamicValues(initialValues);
	}, [selectedCard]);

	const handleVariableChange = (key, value) => {
		setDynamicValues((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const handlePromptInput = () => {
		if (!editableRef.current) return;

		const children = editableRef.current.querySelectorAll('[data-key]');
		const updatedValues = {};
		children.forEach((el) => {
			const key = el.getAttribute('data-key');
			updatedValues[key] = el.textContent;
		});
		setDynamicValues(updatedValues);
	};

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
		// Create the final dynamic prompt by joining the text and replacing variables
		let finalPrompt = parsedPrompt
			.map((part) => {
				if (part.type === 'text') {
					return part.value; // If it's regular text, keep it as it is
				} else if (part.type === 'variable') {
					// Replace the variable with its value from dynamicValues
					return dynamicValues[part.value] || `[${part.value}]`; // Use the value if available, otherwise keep the placeholder
				}
				return '';
			})
			.join(''); // Join all parts into a single string

		// Update activePromptForChat with the final string
		updateStateValues({ activePromptForChat: finalPrompt });

		// Close the modal and navigate to the chat page
		closeModal();
		navigate(`/chat/${ObjectID().toString()}`);
	}, [parsedPrompt, dynamicValues, updateStateValues, closeModal, navigate]);

	return (
		<ReactModal
			isOpen={open}
			closeModal={closeModal}
			modalType={'center'}
			customStyles={customStyles}
		>
			<div className="promptPopupContainer">
				<div className="promptPopupContainerHeader">
					<div className="promptPopupContainerHeaderLeft">
						<div className="promptPopupContainerHeaderLeftTitle">
							{selectedCard?.title}
						</div>
						{/* <div className="promptPopupContainerHeaderLeftSubtitle">20 Credits</div> */}
					</div>
					<div className="promptPopupContainerHeaderRight" onClick={closeModal}>
						<CrossSvg />
					</div>
				</div>

				<div className="promptPopupContainerBody">
					<div
						className="promptPopupContainerBodyText"
						style={{ whiteSpace: 'pre-wrap' }}
					>
						{parsedPrompt.map((part, index) => {
							if (part.type === 'text') {
								// If it's regular text (including brackets), show it as static
								return <span key={index}>{part.value}</span>;
							} else if (part.type === 'variable') {
								// If it's a variable, show the brackets but make the inner content editable
								return (
									<span key={index} style={{ display: 'inline-flex' }}>
										<span style={{ marginRight: '4px' }}>[</span>
										<span
											contentEditable
											suppressContentEditableWarning
											style={{
												borderBottom: '1px dashed var(--stroke)',
												padding: '0 4px',
												color: 'var(--primary-font)',
												outline: 'none',
											}}
											onBlur={(e) => {
												const newValue = e.target.innerText;
												handleVariableChange(part.value, newValue); // Ensure this updates the dynamicValues
											}}
											dangerouslySetInnerHTML={{
												__html: dynamicValues[part.value] || part.value, // Ensure it uses the dynamic state
											}}
										/>
										<span style={{ marginLeft: '4px' }}>]</span>
									</span>
								);
							}
							return null;
						})}
					</div>
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
