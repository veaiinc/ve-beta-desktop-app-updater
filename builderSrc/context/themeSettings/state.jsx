import { useReducer } from 'react';
import Reducer from './reducer';
import { getNumberFromPx } from '../../helper';
import { initialThemeState } from '../../views/components/themeSettings/themeconstants';
import _, { lowerCase } from 'lodash';

//
export const intialState = {
	activeSection: {
		currentSectionTitle: 'Settings',
		currentSectionComponent: 'main_section_component',
		history: [],
	},
	fonts: null,
	sections: null,
	navBar:null,
	applyTheme: false,
	themeSettings: {
		activeTheme: 'theme1',
		colors: {
			id: 'theme',
			primaryColor: '#343A40',
			secondaryColor: '#ADB5BD',
			tertiaryColor: '#F8F9FA',
			quaternaryColor: '#90E0EF',
			quinaryColor: '#CAF0F8',
		},
		button: {
			id: 'theme',
			buttonType: 'primary',
			borderRadius: '125px',
			background: '#F2F2F3',
			color: '#0C0C0D',
			borderWidth: '2px',
			paddingTop: '12px',
			paddingRight: '16px',
			paddingBottom: '12px',
			paddingLeft: '16px',
			fontFamily: 'freight-text-pro, serif',
			fontGroup: 'Serif',
			fontId: '66f2b1919870deb1cc6ece9a',
		},
		font: {
			fontFamily: 'freight-text-pro, serif',
			fontSize: '30px',
			fontStyle: 'normal',
			fontWeight: '400',
			lineHeight: 1,
		},
	},

	newTheme: _.cloneDeep(initialThemeState),
	updateHomeStateFunction: null,
	activeThemeColorsList: null,
};

export const ThemeSettingsState = (props) => {
	const [state, dispatch] = useReducer(Reducer, intialState);

	const updateStateValues = (payload, isInitialState = false) => {
		if (payload?.newTheme && !state.applyTheme && !isInitialState) {
			payload.applyTheme = true;
		}

		dispatch({
			type: 'UPDATE_STATE_VALUES',
			payload,
		});
	};

	const replaceThemeBackgroundColor = (style, bgColor) => {
		style.sectionBackgroundColor = bgColor;
	};

	const replaceThemeShapeColor = (subBlockObject, shapeColor) => {
		subBlockObject.stickerFill = shapeColor;
	};

	const removeSpanTags = (html) => {
		return html.replace(/<\/?span[^>]*>/g, '');
	};

	const removeAllTagsExceptBrAndInput = (html) => {
		let inputIndex = 0;
		let temp = html.replace(/<input[^>]*>/gi, (match) => {
			return `{{INPUT_${inputIndex++}}}`;
		});

		// Then replace br tags
		temp = temp.replace(/<br\s*\/?>/gi, '{{BR}}');
		temp = temp.replace(/<ol\s*\/?>/gi, '{{OL}}').replace(/<\/ol\s*\/?>/gi, '{{/OL}}');
		temp = temp.replace(/<ul\s*\/?>/gi, '{{UL}}').replace(/<\/ul\s*\/?>/gi, '{{/UL}}');

		const firstTagMatch = temp.match(/<[^>]*>/);
		const lastTagMatch = temp.match(/<\/[^>]*>$/);

		if (!firstTagMatch || !lastTagMatch) return html;

		const firstTag = firstTagMatch[0];
		const lastTag = lastTagMatch[0];

		// Remove all other tags except our placeholders
		temp = temp
			.replace(firstTag, '')
			.replace(lastTag, '')
			.replace(/<\/?[^>]+(>|$)/g, '');

		// Get all input tags from original html
		const inputTags = html.match(/<input[^>]*>/gi) || [];

		// Restore br tags
		temp = temp.replace(/{{BR}}/g, '<br>');

		// Restore input tags in their original positions
		temp = temp.replace(/{{INPUT_(\d+)}}/g, (match, index) => {
			return inputTags[parseInt(index)] || '<input>';
		});

		return firstTag + temp + lastTag;
	};

	const replaceThemeStylesInContent = (subBlock, content, currentTheme, type) => {
		if (!content || type === 'button') return content;

		// let updatedContent = removeSpanTags(content);
		let updatedContent = removeAllTagsExceptBrAndInput(content);

		const elementsToColor = [
			'h1',
			'h2',
			'h3',
			'h4',
			'h5',
			'h6',
			'p',
			'span',
			'div',
			'a',
			'li',
			'td',
			'th',
			'ol',
			'ul',
		];

		elementsToColor.forEach((tag) => {
			const regex = new RegExp(`<${tag}([^>]*)>`, 'gi');
			updatedContent = updatedContent.replace(regex, (match, attributes) => {
				let newStyle = '';

				// Don't remove the textAlignMatch from the content
				const textAlignMatch = attributes?.match(
					/style\s*=\s*["'][^"']*text-align[^"']*["']/i,
				);
				let textAlign = '';
				if (textAlignMatch) {
					textAlign = textAlignMatch?.[0]?.match(/text-align:\s*([^;]+)/i)?.[1] || '';
				}

				let tagName = tag;

				if (tag === 'ol' || tag === 'ul') {
					tagName = 'p';
				}

				let themeStyleObject = {
					// ...currentTheme.fonts?.[tag],
					// ...currentTheme?.colors?.text?.[tag],
					fontSize: currentTheme?.fonts?.[tagName]?.fontSize,
				};

				// Convert themeStyleObject to inline style string
				if (themeStyleObject) {
					Object.entries(themeStyleObject).forEach(([key, value]) => {
						// Convert camelCase to kebab-case
						const cssKey = key.replace(/([A-Z])/g, '-$1')?.toLowerCase();
						console.log('cssKey', cssKey);

						if (key === 'fontSize' && tag !== 'li') {
							// Convert px to rem directly without clamp
							const fontSizeInRem = getNumberFromPx(value) / 16;
							newStyle += `${cssKey}: ${fontSizeInRem}rem; `;
						} else {
							newStyle += `${cssKey}: ${value}; `;
						}
					});
				}

				// Combine with existing newStyle
				newStyle = `${newStyle}${textAlign ? `text-align: ${textAlign}; ` : ''}`.trim();

				// Update or add style attribute
				const updatedAttributes = attributes
					?.replace(/\s?style\s*=\s*["'][^"']*["']/i, '')
					?.trim();

				return `<${tag}${updatedAttributes} style="${newStyle}">`;
			});
		});

		subBlock.content = updatedContent;
	};

	return {
		...state,
		updateStateValues,
		replaceThemeBackgroundColor,
		replaceThemeStylesInContent,
		removeSpanTags,
		removeAllTagsExceptBrAndInput,
		replaceThemeShapeColor,
	};
};