import { getDefaultReactSlashMenuItems, SuggestionMenuController } from '@blocknote/react';
import { memo } from 'react';
import { insertImage } from './ImageComponent';
import { insertDatabase } from './Database';
import { filterSuggestionItems } from '@blocknote/core';

const SlashMenu = ({ editor, noteId }) => {
	const getItems = async (query) => {
		// Gets all default slash menu items
		let defaultItems = getDefaultReactSlashMenuItems(editor);

		// Find index of image block in Media group
		const imageBlockIndex = defaultItems.findIndex((item) => item.group === 'Media');
		// Insert the image item in Media group
		defaultItems.splice(imageBlockIndex, 0, insertImage(editor, noteId));

		// Find index of last item in Advanced group
		const lastAdvanceBlockIndex = defaultItems.findLastIndex(
			(item) => item.group === 'Advanced',
		);
		// Insert the database item after Advanced group
		defaultItems.splice(lastAdvanceBlockIndex + 1, 0, insertDatabase(editor, noteId));

		const allowedBlocks = ['heading', 'heading_2', 'heading_3', 'database'];

		// defaultItems = defaultItems.filter((item) => allowedBlocks.includes(item.key));

		// Return filtered items based on the query
		return filterSuggestionItems(defaultItems, query);
	};
	return <SuggestionMenuController triggerCharacter={'/'} getItems={getItems} />;
};

export default memo(SlashMenu);
