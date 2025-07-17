// import React, { Component } from 'react';
import { gql, useMutation } from '@apollo/client';
import Proposals from '../../../controllers/proposals';
import _ from 'lodash';
const moduleQuery = gql`
	query Query($getModuleTemplateId: ID!, $module: String) {
		getModuleTemplate(id: $getModuleTemplateId, module: $module)
	}
`;
class ManageTheme extends Proposals {
	constructor(props) {
		super(props);
		this.state = {
			activeTheme: null,
			activeFont: 0,
			sections: props?.sections,
			isLoading: true,
			activeModule: props?.activeModule,
			fonts: ['Inter', 'Merriweather', 'Roboto', 'Times New Roman'],
			theme: [
				{
					themeColors: [
						{ backgroundColors: ['#5E647E'] },
						{ fontColors: ['#BCAFB9'] },
						{ accentColors: ['#F7EEEB'] },
					],
				},
				{
					themeColors: [
						{ backgroundColors: ['#E6E6E6'] },
						{ fontColors: ['#212E27'] },
						{ accentColors: ['#00662F'] },
					],
				},
				{
					themeColors: [
						{ backgroundColors: ['#FBDAE1'] },
						{ fontColors: ['#803D3F'] },
						{ accentColors: ['#E10032'] },
					],
				},
			],
		};
	}

	componentDidMount = async () => {
		await this.getModuleTemplate(moduleQuery, {
			getModuleTemplateId: this.state?.activeModule?._id,
			module: this.state?.activeModule?.module,
		});
	};
	componentDidUpdate = async (prevProps, prevState) => {
		if (prevState.sections !== this.state.sections && this.state.sections.length > 0) {
			this.getDefaultTheme();
		}
	};
	componentWillReceiveProps = (nextProps) => {
		if (this.state.activeModule !== nextProps.activeModule) {
			this.setState(
				{
					activeModule: nextProps.activeModule,
				},
				async () => {
					await this.getModuleTemplate(moduleQuery, {
						getModuleTemplateId: this.state?.activeModule?._id,
						module: this.state?.activeModule?.module,
					});
				},
			);
		}
		if (this.state.sections !== nextProps.sections && nextProps.sections.length > 0) {
			this.setState({
				sections: nextProps.sections,
			});
		}
	};
	setActiveFont(font) {
		this.setState({ activeFont: font });
	}
	setActiveTheme(theme) {
		this.setState({ activeTheme: theme }, () => {
			this.handleChangeTheme(this.state.themeColors, this.state.theme[theme].themeColors);
		});
	}
	// Function to replace colors in content
	// Function to replace colors in content
	// Function to replace colors in content
	// Function to replace colors in content
	replaceColorsInContent = (content, oldColors, newColors) => {
		if (!content) return content;

		let updatedContent = content;
		const accentColor = this.state.theme[this.state.activeTheme].themeColors[2].accentColors[0];

		// Define the elements we want to apply the new colors to
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
		];

		// Function to get a random color from newColors
		const getRandomNewColor = () => newColors[Math.floor(Math.random() * newColors.length)];

		elementsToColor.forEach((tag) => {
			const regex = new RegExp(`<${tag}([^>]*)>`, 'gi');
			updatedContent = updatedContent.replace(regex, (match, attributes) => {
				// Extract existing style
				const styleMatch = attributes.match(/style\s*=\s*["']([^"']*)["']/i);
				let existingStyle = styleMatch ? styleMatch[1] : '';

				// Remove any existing color property
				existingStyle = existingStyle.replace(/color:[^;]+;?/gi, '');

				// Extract font-size if it exists
				const fontSizeMatch = existingStyle.match(/font-size:\s*(\d+)px/i);
				const fontSize = fontSizeMatch ? parseInt(fontSizeMatch[1]) : 0;

				// Determine which color to use
				const newColor = fontSize > 24 ? accentColor : getRandomNewColor();

				// Append new color to existing style
				const newStyle = `${existingStyle}${
					existingStyle && !existingStyle.endsWith(';') ? ';' : ''
				}color: ${newColor};`.trim();

				// Update or add style attribute
				const updatedAttributes = attributes.replace(/\s?style\s*=\s*["'][^"']*["']/i, '');
				return `<${tag}${updatedAttributes} style="${newStyle}">`;
			});
		});

		return updatedContent;
	};
	// Function to replace colors in sections
	replaceColorsInSections = (sections, oldColors, newColors) => {
		const updatedSections = sections.map((section) => {
			let updatedBlocks;
			if (this.state?.activeModule?.module === 'form') {
				updatedBlocks = section.blocks.map((block) => {
					const updatedContent = this.replaceColorsInContent(
						block.question,
						oldColors,
						newColors,
					);
					return { ...block, question: updatedContent };
				});
			} else {
				updatedBlocks = section.blocks.map((block) => {
					const updatedSubBlocks = block.subBlocks.map((blk) => {
						const updatedContent = this.replaceColorsInContent(
							blk.content,
							oldColors,
							newColors,
						);
						return { ...blk, content: updatedContent ? updatedContent : blk.content };
					});

					return { ...block, subBlocks: updatedSubBlocks };
				});
			}

			return { ...section, blocks: updatedBlocks };
		});

		return updatedSections;
	};
	replaceBackgroundColor = (style, currentColors, newColors) => {
		// Check if style exists
		let bgCurrentColors = currentColors[0].backgroundColors;
		let bgNewColors = newColors[0].backgroundColors;

		// Replace the sectionBackgroundColor property with the new value

		//let currentBGIndex = bgCurrentColors.indexOf(style.sectionBackgroundColor);

		style.sectionBackgroundColor = bgNewColors[0];
	};
	handleChangeTheme = (currentColors, newColors) => {
		let sections = [...this.state.sections];
		sections.forEach((section) => {
			// Replace backgroundColor in section style

			this.replaceBackgroundColor(section.style, currentColors, newColors);

			// Iterate through blocks in the section
			// section.blocks.forEach((block) => {
			// 	// Replace backgroundColor in block style

			// 	this.replaceBackgroundColor(block.style, currentColors, newColors);
			// });
		});
		sections = this.replaceColorsInSections(
			sections,
			currentColors[1].fontColors,
			newColors[1].fontColors,
		);

		this.props.changeSections(sections, this.state?.activeModule?._id);
	};
	getDefaultTheme = () => {
		let backgroundColors = [];
		let sections = [...this.state.sections];

		if (_.size(sections) > 0 && Array.isArray(sections)) {
			// Collect background colors
			sections.forEach((section) => {
				if (_.size(section) > 0 && section.blocks) {
					if (
						section.style &&
						section.style.sectionBackgroundColor &&
						this.isValidColor(section.style.sectionBackgroundColor)
					) {
						backgroundColors.push(section.style.sectionBackgroundColor);
					}
					section.blocks.forEach((block) => {
						if (
							block &&
							block.style &&
							block.style.sectionBackgroundColor &&
							this.isValidColor(block.style.sectionBackgroundColor)
						) {
							backgroundColors.push(block.style.sectionBackgroundColor);
						}
					});
				}
			});

			const uniqueColorsFromContent = this.getAllColorsFromContent(sections);

			// Get top 3 most frequent colors for both arrays
			const topBackgroundColors = this.getTopColors(backgroundColors, 1);
			const topFontColors = this.getTopColors(uniqueColorsFromContent, 1);

			this.setState({
				themeColors: [
					{ backgroundColors: topBackgroundColors },
					{ fontColors: topFontColors },
				],
			});
		}
	};

	isValidColor = (color) => {
		// Skip transparent and white colors
		const invalidColors = [
			'rgba(255,255,255,0)',
			'rgba(255, 255, 255, 0)',
			'transparent',
			'#fff',
			'#ffffff',
			'rgb(255,255,255)',
			'rgb(255, 255, 255)',
			'white',
		];
		return !invalidColors.includes(color?.toLowerCase());
	};

	getTopColors = (colors, count) => {
		// Create frequency map
		const frequencyMap = colors.reduce((acc, color) => {
			acc[color] = (acc[color] || 0) + 1;
			return acc;
		}, {});

		// Convert to array, sort by frequency, and get top colors
		return Object.entries(frequencyMap)
			.sort(([, a], [, b]) => b - a) // Sort by frequency
			.slice(0, count) // Get top 'count' entries
			.map(([color]) => color); // Extract just the color values
	};

	getAllColorsFromContent = (sections) => {
		const allColors = [];

		sections.forEach((section) => {
			section.blocks.forEach((block) => {
				if (this.state?.activeModule?.module === 'form') {
					const blockColors = this.extractColorsFromContent(block.question);
					allColors.push(...blockColors.filter((color) => this.isValidColor(color)));
				} else {
					if (_.has(block, 'subBlocks')) {
						block?.subBlocks.forEach((blk) => {
							const blockColors = this.extractColorsFromContent(blk.content);
							allColors.push(
								...blockColors.filter((color) => this.isValidColor(color)),
							);
						});
					}
				}
			});
		});

		return [...new Set(allColors)];
	};

	extractColorsFromContent = (content) => {
		const colors = [];

		const extractColors = (html) => {
			const div = document.createElement('div');
			div.innerHTML = html;

			const elements = div.querySelectorAll('[style*="color"]');
			elements.forEach((element) => {
				const colorStyle = element.style.color;
				if (colorStyle) {
					const hexColor = this.rgbToHex(colorStyle);
					colors.push(hexColor.toUpperCase());
				}
			});
		};

		extractColors(content);
		return colors;
	};

	rgbToHex = (rgb) => {
		// Check if the color is already in hex format
		if (rgb.charAt(0) === '#') {
			return rgb;
		}

		// Extract the RGB values
		const rgbValues = rgb.match(/\d+/g);
		if (!rgbValues || rgbValues.length !== 3) {
			return rgb; // Return original value if it's not a valid RGB color
		}

		// Convert RGB to HEX
		return (
			'#' +
			rgbValues
				.map((x) => {
					const hex = parseInt(x).toString(16);
					return hex.length === 1 ? '0' + hex : hex;
				})
				.join('')
		);
	};
	render() {
		return (
			<>
				{this.state.isLoading ? (
					''
				) : (
					<div className="generate-theme-wrapper">
						<div className="gtw-header">
							<h4>Fonts</h4>
						</div>
						<div className="hrw-fonts-container">
							{_.map(this.state.fonts, (font, k) => {
								return (
									<a
										style={{
											border:
												this.state.activeFont === k
													? '1px solid #6055ec'
													: '',
											cursor: 'pointer',
										}}
										onClick={() => this.setActiveFont(k)}
									>
										<span style={{ fontFamily: font }}>Aa</span>
										<label style={{ textTransform: 'capitalize' }}>
											{font}
										</label>
									</a>
								);
							})}
						</div>
						<div className="gtw-header">
							<h4>Colors</h4>
						</div>
						<div className="hrw-colors-container">
							<div
								style={{
									display: 'flex',
									flexWrap: 'wrap',
									width: '100%',
									gap: '15px',
								}}
							>
								{_.map(this.state.theme, (theme, index) => (
									<div
										key={index}
										style={{
											display: 'flex',
											width: '20%',
											height: '38px',
											borderRadius: '50px',
											overflow: 'hidden',
											margin: '3px',
											cursor: 'pointer',
											border: _.isEqual(this.state.activeTheme, index)
												? ' 2px solid #6055ec'
												: '2px solid transparent',
										}}
										onClick={(e) => this.setActiveTheme(index)}
									>
										<span
											style={{
												background:
													theme?.themeColors[0].backgroundColors[0],
												width: '33.33%',
												height: '100%',
											}}
										></span>
										<span
											style={{
												background: theme?.themeColors[1]?.fontColors[0],
												width: '33.33%',
												height: '100%',
											}}
										></span>
										<span
											style={{
												background: theme?.themeColors[2]?.accentColors[0],
												width: '33.33%',
												height: '100%',
											}}
										></span>
									</div>
								))}
							</div>
						</div>
					</div>
				)}
			</>
		);
	}
}

export default ManageTheme;
