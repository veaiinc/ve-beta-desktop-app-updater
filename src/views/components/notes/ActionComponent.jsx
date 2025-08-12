import { createReactInlineContentSpec } from '@blocknote/react';
import { memo, useContext } from 'react';
import { EditorContext } from './Editor';

const containerCss = {
	display: 'inline-flex',
	alignItems: 'center',
	padding: '0 4px',
	borderRadius: '4px',
	fontSize: '0.9em',
	border: '1px solid var(--primary-font)',
	color: 'var(--primary-font)',
};

const imgCss = {
	width: '16px',
	height: '16px',
	marginRight: '4px',
	borderRadius: '4px',
};

// Inline component for rendering the action tag
const ActionComponent = ({ inlineContent }) => {
	const { customBlockData } = useContext(EditorContext);
	const { actionDetails } = customBlockData;

	// Try to find action from customBlockData first
	let action = actionDetails?.find((item) => item.actionData?.id === inlineContent.props.action);

	// If not found in customBlockData, use props directly
	if (!action && inlineContent.props.toolName) {
		action = {
			actionData: {
				image_src: inlineContent.props.toolkit
					? `https://api.composio.dev/toolkits/${inlineContent.props.toolkit}/logo`
					: null,
			},
			actionName: inlineContent.props.toolName,
		};
	}

	return (
		<span style={containerCss}>
			<span style={{ opacity: 0, visibility: 'hidden', display: 'none' }}>
				{`<tool key="${inlineContent.props.action}">`}
			</span>
			{action?.actionData?.image_src && (
				<img src={action?.actionData?.image_src} style={imgCss} />
			)}

			{inlineContent.props.action}
			<span style={{ opacity: 0, visibility: 'hidden', display: 'none' }}>{`</tool>`}</span>
		</span>
	);
};

export default memo(ActionComponent);

// Inline spec for the action tag
export const ActionInline = createReactInlineContentSpec(
	{
		type: 'action',
		propSchema: {
			action: { default: '' },
			toolkit: { default: '' },
			toolName: { default: '' },
		},
		content: 'none',
	},
	{
		render: ActionComponent,
	},
);

// Command to insert an inline action into the editor
export const insertAction = (editor) => ({
	title: 'Action',
	subtext: 'Insert an inline action tag',
	key: 'action',
	onItemClick: () => {
		editor.insertInlineContent([
			{
				type: 'action',
				props: { action: 'my-custom-action' },
			},
			' ', // space after for convenience
		]);
	},
	aliases: ['action', 'tag'],
	group: 'Inline',
	icon: <span>🔧</span>,
});
