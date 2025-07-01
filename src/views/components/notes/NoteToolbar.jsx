import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';
import {
	BasicTextStyleButton,
	BlockTypeSelect,
	CreateLinkButton,
	FileCaptionButton,
	FileReplaceButton,
	FormattingToolbar,
	FormattingToolbarController,
	NestBlockButton,
	TextAlignButton,
	UnnestBlockButton,
} from '@blocknote/react';
import AskAiButton from './AskAiButton';
import { memo, useEffect } from 'react';
import TextColorPicker from './TextColorPicker';
// import { useBlockNoteEditor, useComponentsContext } from '@blocknote/react';
import AlignButton from './AlignButton';

const NoteToolbar = memo(({ sendMessage, aiResonse, resetAiResponse }) => {
	return (
		<FormattingToolbarController
			formattingToolbar={() => (
				<FormattingToolbar>
					<BlockTypeSelect key={'blockTypeSelect'} />

					<TextColorPicker key={'colorStyleButton1'} />

					<FileCaptionButton key={'fileCaptionButton'} />
					<FileReplaceButton key={'replaceFileButton'} />

					<BasicTextStyleButton basicTextStyle={'bold'} key={'boldStyleButton'} />
					<BasicTextStyleButton basicTextStyle={'italic'} key={'italicStyleButton'} />
					<BasicTextStyleButton
						basicTextStyle={'underline'}
						key={'underlineStyleButton'}
					/>
					<BasicTextStyleButton basicTextStyle={'strike'} key={'strikeStyleButton'} />
					<span className="bn-divider" />
					{/* Extra button to toggle code styles */}
					<BasicTextStyleButton key={'codeStyleButton'} basicTextStyle={'code'} />

					<AlignButton />

					{/* <TextAlignButton textAlignment={'left'} key={'textAlignLeftButton'} />
					<TextAlignButton textAlignment={'center'} key={'textAlignCenterButton'} />
					<TextAlignButton textAlignment={'right'} key={'textAlignRightButton'} /> */}
					<NestBlockButton key={'nestBlockButton'} />
					<UnnestBlockButton key={'unnestBlockButton'} />

					<CreateLinkButton key={'createLinkButton'} />
					<AskAiButton
						key={'askAiButton'}
						sendMessage={sendMessage}
						aiResonse={aiResonse}
						resetAiResponse={resetAiResponse}
					/>
				</FormattingToolbar>
			)}
		/>
	);
});

export default NoteToolbar;
