import { getDefaultReactSlashMenuItems, SuggestionMenuController } from '@blocknote/react';
import { memo, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { insertImage } from './ImageComponent';
import { insertDatabase } from './Database';
import { filterSuggestionItems } from '@blocknote/core';
import SlashMenuComponent from './SlashMenuComponent';
import ToolsSuggestionMenu from './ToolsSuggestionMenu';
import { insertAction } from './ActionComponent';
import Context from '../../../context/context';
import { useParams } from 'react-router-dom';

const ActionsMenu = ({ editor, noteId }) => {
	const { agentId } = useParams();
	const {
		knowledgeAgent: { actionsInfo },
	} = useContext(Context);

	// State to manage actions data and UI states
	const [info, setInfo] = useState({
		actions: [],
		isLoading: false,
		error: null,
		search: '',
		hasNextPage: false,
		page: 1,
		perPage: 10,
		totalActions: 0,
		isConnecting: false,
		connectedAccounts: [],
		accountsLoading: false,
		checkingAccounts: false,
		selectedCategory: 'all',
		selectedUseCase: null,
		selectedApp: null,
	});

	useEffect(() => {
		if (actionsInfo) {
			setInfo((prev) => ({ ...prev, actions: actionsInfo?.data || [] }));
		}
	}, [actionsInfo]);

	return (
		<>
			{/* Tools suggestion menu triggered by '<' */}
			<SuggestionMenuController
				triggerCharacter={'<'}
				getItems={async (query) => {
					// handleSearchChange(query);
					const items = info?.actions.map((action) => ({
						title: action.typeDependencies.name,
						key: action.typeDependencies.key,
						icon: <img src={action.typeDependencies.logoUrl} alt="" />,
						onItemClick: () => {
							editor.suggestionMenus.clearQuery();
							editor.insertInlineContent([
								{
									type: 'action',
									props: { action: action.typeDependencies.key },
								},
								' ', // space after for convenience - this is crucial for clearing trigger
							]);
						},
						// Add these properties to make it work like default items
						group: 'Actions',
						aliases: [action.typeDependencies.name.toLowerCase()],
					}));

					return filterSuggestionItems(items, query);
				}}
				suggestionMenuComponent={ToolsSuggestionMenu}
			/>
		</>
	);
};

export default memo(ActionsMenu);
