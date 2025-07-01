import React, { Component, createRef } from 'react';
import './add-block.scss';
import { Tooltip } from 'antd';
import { ReactComponent as Icon } from './next.svg';
// import { gsap } from 'gsap';

const baseUrl = 'https://ap.images.ve.ai';

const header1 = `${baseUrl}/public/Headers/File1.jpg`;
const header2 = `${baseUrl}/public/Headers/File2.jpg`;
const header3 = `${baseUrl}/public/Headers/File3.jpg`;
const header4 = `${baseUrl}/public/Headers/File4.jpg`;
const header5 = `${baseUrl}/public/Headers/File5.jpg`;
const header6 = `${baseUrl}/public/Headers/File6.jpg`;
const header7 = `${baseUrl}/public/Headers/File7.jpg`;
const header8 = `${baseUrl}/public/Headers/File8.jpg`;
const header9 = `${baseUrl}/public/Headers/File9.jpg`;
const header10 = `${baseUrl}/public/Headers/File10.jpg`;
const header11 = `${baseUrl}/public/Headers/File11.jpg`;
const header12 = `${baseUrl}/public/Headers/File12.jpg`;
const header13 = `${baseUrl}/public/Headers/File13.jpg`;
// import scroll1 from './addblock/header/scroll.png';

const text1 = `${baseUrl}/public/Texts/File1.jpg`;
const text2 = `${baseUrl}/public/Texts/File2.jpg`;
const text3 = `${baseUrl}/public/Texts/File3.jpg`;
const text4 = `${baseUrl}/public/Texts/File4.jpg`;
const text5 = `${baseUrl}/public/Texts/File5.jpg`;
const text6 = `${baseUrl}/public/Texts/File6.jpg`;
const text7 = `${baseUrl}/public/Texts/File7.jpg`;
const text8 = `${baseUrl}/public/Texts/File8.jpg`;
const text9 = `${baseUrl}/public/Texts/File9.jpg`;
const text10 = `${baseUrl}/public/Texts/File10.jpg`;
// import text11 from './addblock/Text/File11.jpg';
// import text12 from './addblock/text/17.jpg';
// import text13 from './addblock/text/18.jpg';

const gallery1 = `${baseUrl}/public/Gallerys/File1.jpg`;
const gallery2 = `${baseUrl}/public/Gallerys/File2.jpg`;
const gallery3 = `${baseUrl}/public/Gallerys/File3.jpg`;
const gallery4 = `${baseUrl}/public/Gallerys/File4.jpg`;
const gallery5 = `${baseUrl}/public/Gallerys/File5.jpg`;
const gallery6 = `${baseUrl}/public/Gallerys/File6.jpg`;
const gallery7 = `${baseUrl}/public/Gallerys/File7.jpg`;
const gallery8 = `${baseUrl}/public/Gallerys/File8.jpg`;

const image1 = `${baseUrl}/public/Images/File1.jpg`;
const image2 = `${baseUrl}/public/Images/File2.jpg`;
const image3 = `${baseUrl}/public/Images/File3.jpg`;
const image4 = `${baseUrl}/public/Images/File4.jpg`;
const image5 = `${baseUrl}/public/Images/File5.jpg`;
const image6 = `${baseUrl}/public/Images/File6.jpg`;
const image7 = `${baseUrl}/public/Images/File7.jpg`;
const image8 = `${baseUrl}/public/Images/File8.jpg`;
const image9 = `${baseUrl}/public/Images/File9.jpg`;
// import image10 from `./addblock/Images/File10.jpg`;
// import image11 from './addblock/Images/File11.jpg';
// import image12 from './addblock/Images/File12.jpg';
// import image13 from './addblock/Images/File13.jpg';
// import image14 from './addblock/Images/File14.jpg';

const services1 = `${baseUrl}/public/services/1.jpg`;

const OldForm = `${baseUrl}/public/forms/old_form.png`;
const LogicalForm = `${baseUrl}/public/forms/logicalform.png`;

const events1 = `${baseUrl}/public/events/1.jpg`;

const signature1 = `${baseUrl}/public/signature/signature.png`;
const contract1 = `${baseUrl}/public/signature/contact.png`;

const lists1 = `${baseUrl}/public/List/File1.jpg`;
const lists2 = `${baseUrl}/public/List/File2.jpg`;
const lists3 = `${baseUrl}/public/List/File3.jpg`;
const lists4 = `${baseUrl}/public/List/File4.jpg`;
const lists5 = `${baseUrl}/public/List/File5.jpg`;
const lists6 = `${baseUrl}/public/List/File6.jpg`;
const lists7 = `${baseUrl}/public/List/File7.jpg`;
const lists8 = `${baseUrl}/public/List/File8.jpg`;
const lists9 = `${baseUrl}/public/List/File9.jpg`;
const lists10 = `${baseUrl}/public/List/File10.jpg`;
// import lists11 from './addblock/lists/list11.jpg';
// import lists12 from './addblock/lists/list12.jpg';
// import lists13 from './addblock/lists/list13.png';
// import lists14 from './addblock/lists/list14.jpg';
// import lists15 from './addblock/lists/list15.png';
// import lists16 from './addblock/lists/list16.png';

const testimonial1 = `${baseUrl}/public/testimonial/tm1.png`;
const testimonial2 = `${baseUrl}/public/testimonial/tm2.png`;
const testimonial3 = `${baseUrl}/public/testimonial/tm3.png`;
const testimonial4 = `${baseUrl}/public/testimonial/tm4.png`;
const testimonial5 = `${baseUrl}/public/testimonial/tm5.jpg`;
const testimonial6 = `${baseUrl}/public/testimonial/tm6.png`;

const footer1 = `${baseUrl}/public/Footers/File1.jpg`;
const footer2 = `${baseUrl}/public/Footers/File2.jpg`;
const footer3 = `${baseUrl}/public/Footers/File3.jpg`;
const footer4 = `${baseUrl}/public/Footers/File4.jpg`;
// import footer5 from './addblock/Footers/File5.jpg';

const magazine1 = `${baseUrl}/public/magazine/magazine1.png`;
const magazine2 = `${baseUrl}/public/magazine/magazine2.png`;
const magazine3 = `${baseUrl}/public/magazine/magazine3.png`;
const magazine4 = `${baseUrl}/public/magazine/magazine4.png`;
const magazine5 = `${baseUrl}/public/magazine/magazine5.png`;
const magazine6 = `${baseUrl}/public/magazine/magazine6.png`;
const magazine7 = `${baseUrl}/public/magazine/magazine7.png`;
const magazine8 = `${baseUrl}/public/magazine/magazine8.png`;
const magazine9 = `${baseUrl}/public/magazine/magazine9.png`;
const magazine10 = `${baseUrl}/public/magazine/magazine10.jpg`;

const video1 = `${baseUrl}/public/video/video1.jpg`;

// import element1 from './addblock/text/17.jpg';
// import element2 from './addblock/image/img14.jpg';
const embed1 = `${baseUrl}/public/embed/embed1.png`;

const journey1 = `${baseUrl}/public/journeys/journey1.png`;

const table1 = `${baseUrl}/public/Table/Table.png`;

const invoicePayment = `${baseUrl}/public/invoices/paymentSchedules.png`;
const invoice1 = `${baseUrl}/public/invoices/Invoice1.png`;

const summary1 = `${baseUrl}/public/image/img15.png`;
const schedular1 = `${baseUrl}/public/scheduler/scheduler1.png`;

// import { ReactComponent as Header } from '../addBlock/icons/header.svg';
// import { ReactComponent as List } from '../addBlock/icons/list.svg';
// import { ReactComponent as Footer } from '../addBlock/icons/footer.svg';
// import { ReactComponent as Events } from '../addBlock/icons/events.svg';
// import { ReactComponent as Gallery } from '../addBlock/icons/gallery.svg';
// import { ReactComponent as Image } from '../addBlock/icons/image.svg';
// import { ReactComponent as Services } from '../addBlock/icons/services.svg';
// import { ReactComponent as Testimonials } from '../addBlock/icons/testimonials.svg';
// import { ReactComponent as Text } from '../addBlock/icons/text.svg';
// import { ReactComponent as Video } from '../addBlock/icons/videoSvg.svg';
// import { ReactComponent as Embed } from '../addBlock/icons/embed.svg';
// import { ReactComponent as Journey } from '../addBlock/icons/journey.svg';
// import { ReactComponent as Table } from '../addBlock/icons/table.svg';

// Left bar new
// import { ReactComponent as AddBlank } from '../svgs/LeftBar/Addblock.svg';
import { ReactComponent as Divider } from '../svgs/LeftBar/Divider.svg';
import { ReactComponent as HeaderNew } from '../svgs/LeftBar/Header.svg';
import { ReactComponent as ServiceNew } from '../svgs/LeftBar/Service.svg';
import { ReactComponent as EventsNew } from '../svgs/LeftBar/Events.svg';
import { ReactComponent as GalleryNew } from '../svgs/LeftBar/Gallery.svg';
import { ReactComponent as ImageNew } from '../svgs/LeftBar/Image.svg';
import { ReactComponent as TextNew } from '../svgs/LeftBar/Text.svg';
import { ReactComponent as VideoNew } from '../svgs/LeftBar/Video.svg';
import { ReactComponent as ListNew } from '../svgs/LeftBar/List.svg';
import { ReactComponent as FooterNew } from '../svgs/LeftBar/Footer.svg';
import { ReactComponent as JourneyNew } from '../svgs/LeftBar/Journey.svg';
import { ReactComponent as EmbedNew } from '../svgs/LeftBar/Embed.svg';
import { ReactComponent as AcceptNew } from '../svgs/LeftBar/Accept.svg';
import { ReactComponent as FormNew } from '../svgs/LeftBar/Form.svg';
import { ReactComponent as ContractNew } from '../svgs/LeftBar/Contract.svg';
import { ReactComponent as SummaryNew } from '../svgs/LeftBar/Summary.svg';
import { ReactComponent as InvoiceNew } from '../svgs/LeftBar/Invoice.svg';
import { ReactComponent as SchedulerNew } from '../svgs/LeftBar/Scheduler.svg';
import { ReactComponent as AIassit } from '../svgs/LeftBar/AIassit.svg';
import { ReactComponent as Saved } from '../svgs/LeftBar/Saved.svg';
import { ReactComponent as NewTable } from '../svgs/LeftBar/NewTable.svg';

import _, { set } from 'lodash';

// Data arrays for each section
const headers = [
	{ img: header1, _id: '67d941784d306ebd76aebbcb' }, // fluid layout
	{ img: header2, _id: '67d941784d306ebd76aebbcc' }, // fluid layout
	{ img: header3, _id: '67ce93ed300ac9b1873deb9f' }, // fluid layout
	{ img: header4, _id: '67ce99e94ec00e80307f571f' }, // fluid layout
	{ img: header5, _id: '67ce9fe06fb27b19f15fb0fe' }, // fluid layout
	{ img: header6, _id: '67cea21db461c6323b21e030' }, // fluid layout
	{ img: header7, _id: '67ceb5f499757ad2a213ae3d' }, // fluid layout
	{ img: header8, _id: '67cebbcf852fc7e363532bc7' }, // fluid layout
	{ img: header9, _id: '67cec73cf10ef4e5278be827' }, // fluid layout
	{ img: header10, _id: '67cec734f10ef4e5278be825' }, // fluid layout
	{ img: header11, _id: '67cede334fb8c60a0a34ffcc' }, // fluid layout
	{ img: header12, _id: '67cee037a5ff5760283c79c0' }, // fluid layout
	{ img: header13, _id: '67cee1533b5d368f78cb853a' },
	// { img: scroll1, _id: '6721e612dd130cc7c9ece574' },
	{ img: header13, _id: '67d941784d306ebd76aebbcb' },
];

const text = [
	{ img: text1, _id: '67ce90a4cc385bea476e6956' }, //1
	{ img: text2, _id: '67ce9246f8ccb742ce36c768' }, //2
	{ img: text3, _id: '67ce9323adeb1568c8f09542' }, //3
	{ img: text4, _id: '67ce9f896fb27b19f15fb0fa' }, //4
	{ img: text5, _id: '67cea125b2c0fb2dd187979b' }, //5 unsplash
	{ img: text6, _id: '67cef40d4d5e79d00d661ff7' }, //6
	{ img: text7, _id: '67cef5577e8b056ad0be1089' }, //7 text added
	{ img: text8, _id: '67cef5e2fd786a1e5229b1a2' }, //8
	{ img: text9, _id: '67cef7377e8b056ad0be108d' }, //9
	{ img: text10, _id: '67cef884959017012eea4add' }, //11
];

const gallery = [
	{ img: gallery1, _id: '67cff307eeb49f4498fa47e6' }, //1 unsplash
	{ img: gallery2, _id: '67cfeceaa575e86281f5107e' }, //2 unsplash
	{ img: gallery3, _id: '67cfecf9a575e86281f51083' }, //3 galleryshape id
	{ img: gallery4, _id: '67cfe2db4277ff32eacaa086' }, //4
	{ img: gallery5, _id: '67cfeca8bb56e0167604d745' }, //5 unsplash
	{ img: gallery6, _id: '67cff0cb18f6ed586b1208d5' }, //6 unsplash
	{ img: gallery7, _id: '67cfed8318f6ed586b1208cc' }, //7 unsplash
	{ img: gallery8, _id: '67cff0bf18f6ed586b1208d3' },
];

const image = [
	{ img: image1, _id: '67cfd1502c03c8561ab6d87c' },
	{ img: image2, _id: '67cfd61a722f635a5601be19' },
	{ img: image3, _id: '67cfd40d4277ff32eacaa06f' }, //3 unsplash
	{ img: image4, _id: '67cfd4044277ff32eacaa06d' }, //4 unsplash
	{ img: image5, _id: '67cfd77c6f62f32775dc6974' }, //5 unsplash
	{ img: image6, _id: '67cfdb85971feb2b10be134f' }, //6 unsplash
	{ img: image7, _id: '67cfdb7e971feb2b10be134d' }, //7 unsplash
	{ img: image8, _id: '67cfd0a4b3b646aa3e31fbaf' }, //8 unsplash
	{ img: image9, _id: '67cfdfa3dff17927cef9e20a' }, //9 unsplash
];

const services = [{ img: services1, _id: '6679683d5fa3e9d945138016' }];

const events = [{ img: events1, _id: '6687ca4f6921b1f4711c017a' }];

const form = [
	{ img: OldForm, _id: '676a68d77dd00ba5a35ee1f9' },
	{ img: LogicalForm, _id: '679332cc8deffd56077f9ac2' },
];

const signature = [
	{ img: contract1, _id: '67165712f9a74b97c60d1f05' },
	{ img: signature1, _id: '677632a057d198b1cd34a45c' },
];

const invoice = [
	{ img: invoice1, _id: '6780e5c870a81546fd614917' },
	{ img: invoicePayment, _id: '6773c577a94cd9c4978dbbe4' },
];

const accept = [{ img: text7, _id: '67825b4a3a7c6e4225fa56c5' }];

const summary = [{ img: summary1, _id: '6790e22524301aa2a959796c' }];
const scheduler = [{ img: schedular1, _id: '67cac5672605a055f16c5601' }];

const lists = [
	{ img: lists1, _id: '67cfcfe04277ff32eacaa065' },
	{ img: lists2, _id: '67cfd1396c09cee4df3f37ae' },
	{ img: lists3, _id: '67cfd8aba85715c0d3da2cbc' },
	{ img: lists4, _id: '67cfdc9b306198169eebf10e' },
	{ img: lists5, _id: '67cfdfca7f24440647a3668d' },
	{ img: lists6, _id: '67cfe3b14277ff32eacaa089' },
	{ img: lists7, _id: '67cffbabd06920743b23db20' },
	{ img: lists8, _id: '67d000eed06920743b23db2a' },
	{ img: lists9, _id: '67d005230e1ddf4605d0a181' },
	{ img: lists10, _id: '67d0094cd06920743b23db3c' },
];

const testimonial = [
	{ img: testimonial1, _id: '670e1ad8ea1d68e32470c671' }, //1 unsplash
	{ img: testimonial2, _id: '6711f96eccaac694b9a28e03' }, //2 unsplash
	{ img: testimonial3, _id: '670e1e7ec0c3d57de8efb5d0' }, //3 unsplash
	{ img: testimonial4, _id: '670e200f391b0b2b231b1708' }, //4 unsplash
	{ img: testimonial5, _id: '6703d56dff47a9df683984c2' },
	{ img: testimonial6, _id: '670e20c51f2ce5fe2b761b24' }, //6 unsplash
];

const footer = [
	{ img: footer1, _id: '67d006ac48da89788c1f6505' },
	{ img: footer2, _id: '67d00c1b6752490705a994b7' },
	{ img: footer3, _id: '67d01a14cc35e9e8ae175a0a' },
	{ img: footer4, _id: '67d00edfbe46f7334d82a67d' },
];

const magazine = [
	{ img: magazine1, _id: '670d1283fecc0eb26d1e43c5' },
	{ img: magazine2, _id: '671114c3db3dcd1ac53050e4' },
	{ img: magazine3, _id: '670d13d81a5013f74316975d' },
	{ img: magazine4, _id: '670d1481b194191794dee707' },
	{ img: magazine5, _id: '670d14e51907cb44f303c011' },
	{ img: magazine6, _id: '670d1645be815ba4bd2f6c8e' },
	{ img: magazine7, _id: '670d1729be815ba4bd2f6cbf' },
	{ img: magazine8, _id: '670d17a334202214e208669e' },
	{ img: magazine9, _id: '670d181d34202214e20866e4' },
	{ img: magazine10, _id: '670d1894f5cdf10e8e59b59a' },
];

const videos = [{ img: video1, _id: '670f9c0dc77e0a96244e4057' }];

// const elements = [
//     { img: element1, text: 'text', _id: '6717413415e02bdd2b316121' },
//     { img: element2, text: 'image', _id: '6717413415e02bdd2b316122' },
//     { img: element2, text: 'button', _id: '6717413415e02bdd2b316122' },
//     { img: element2, text: 'icon', _id: '6717413415e02bdd2b316122' },
//     { img: element2, text: 'video', _id: '6717413415e02bdd2b316122' },
//     { img: element2, text: 'shape', _id: '6717413415e02bdd2b316122' },
//     { img: element2, text: 'sticker', _id: '6717413415e02bdd2b316122' },
//     { img: element2, text: 'circleText', _id: '6717413415e02bdd2b316122' },
//     { img: element2, text: 'listIcon', _id: '6717413415e02bdd2b316122' },
//     { img: element2, text: 'logoSticker', _id: '6717413415e02bdd2b316122' },
//     { img: element2, text: 'iframe', _id: '6717413415e02bdd2b316122' },
// ];

const embed = [{ img: embed1, _id: '674d687ff973b859ae0b8285' }];

const journey = [{ img: journey1, _id: '675039c8cc2cb88a3fb8a37d' }];

const table = [{ img: table1, _id: '677bb6477b3b292575734ff2' }];

class AddBlockV2 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: 'header',
			isElement: props.isElement,
			template: props.template,
			showRightBar: false,
			hoverImage: null,
			scroolCalled: false,
			isManualScrolling: false,
			tabsclicked: false,
			isFormTemplate: props.isFormTemplate || false,
		};

		this.sections = [
			{ name: 'header', data: headers, title: 'Header' },
			{ name: 'text', data: text, title: 'Text' },
			{ name: 'image', data: image, title: 'Image' },
			{ name: 'video', data: videos, title: 'Video' },
			{ name: 'lists', data: lists, title: 'Lists' },
			{ name: 'gallery', data: gallery, title: 'Gallery' },
			{ name: 'footer', data: footer, title: 'Footer' },

			{ name: 'journey', data: journey, title: 'Journey' },
			{ name: 'table', data: table, title: 'Table' },

			...(this.state.isFormTemplate
				? []
				: [
						{ name: 'form', data: form, title: 'Form' },
						{ name: 'services', data: services, title: 'Services' },
						{ name: 'events', data: events, title: 'Events' },
						{ name: 'embed', data: embed, title: 'Embed' },
						{ name: 'invoice', data: invoice, title: 'Invoice' },
						{ name: 'contract', data: signature, title: 'Contract' },
						{ name: 'accept', data: accept, title: 'Accept' },
						{ name: 'scheduler', data: scheduler, title: 'Scheduler' },
						{ name: 'summary', data: summary, title: 'Summary' },
				  ]),

			// { name: 'testimonial', data: testimonial, title: 'Testimonial' },
			// { name: 'magazine', data: magazine, title: 'Magazine' },
			// { name: 'table', data: table, title: 'Table' },
		];

		// Create a refs object with a ref for each section
		this.sectionRefs = {};
		this.sections.forEach((section) => {
			this.sectionRefs[section.name] = createRef();
		});

		// Create an observer
		this.observer = null;
	}

	componentDidMount() {
		// Set up the Intersection Observer
		this.setupObserver();

		// Always set activeTab to 'header' initially
		this.setState({
			activeTab: 'header',
			showRightBar: true,
		});
	}

	componentWillUnmount() {
		// Disconnect the observer when the component unmounts
		if (this.observer) {
			this.observer.disconnect();
		}
	}
	setupObserver = () => {
		const options = {
			root: document.querySelector('.ab-r-bottom'),
			rootMargin: '0px',
			threshold: 0.5, // Trigger when 50% of the section is visible
		};

		this.observer = new IntersectionObserver((entries) => {
			if (!this.isManualScrolling) {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const sectionName = entry.target.getAttribute('data-section');
						this.setState({ activeTab: sectionName });
					}
				});
			}
		}, options);

		this.sections.forEach((section) => {
			const ref = this.sectionRefs[section.name];
			if (ref.current) {
				ref.current.setAttribute('data-section', section.name);
				this.observer.observe(ref.current);
			}
		});
	};

	scrollToSection = (sectionName) => {
		const ref = this.sectionRefs[sectionName];
		if (ref && ref.current) {
			this.setState({
				activeTab: sectionName,
				tabsclicked: true, // Set tabsclicked to true when scrolling to a section
			});

			this.isManualScrolling = true;
			ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
			setTimeout(() => {
				this.isManualScrolling = false;
			}, 1000);
		}
	};

	renderSection = (section) => {
		const { name, title, data } = section;
		const ref = this.sectionRefs[name];

		return (
			<div ref={ref} className="section" data-section={name}>
				<h2 style={{ fontSize: '14px', fontWeight: '500', color: 'white' }}>{title}</h2>
				<div className="headers-list">
					{data.map((item, i) => (
						<span
							key={item._id + i}
							className="animated-item"
							onMouseEnter={() => this.setState({ hoverImage: item.img })}
							onMouseLeave={() => this.setState({ hoverImage: null })}
						>
							<img src={item.img} alt={`${title} ${i + 1}`} />
							<div
								className="hover-add"
								onClick={(e) =>
									this.props.handleAddLayout(
										item._id,
										null,
										name === 'services',
										name === 'invoice',
										name === 'scheduler',
									)
								}
							>
								{/* <p>
                                    <AddBlank />
                                </p> */}
							</div>
						</span>
					))}
				</div>
			</div>
		);
	};

	render() {
		// Get the icons for each section
		const getSectionIcon = (name) => {
			switch (name) {
				case 'header':
					return <HeaderNew />;
				case 'text':
					return <TextNew />;
				case 'image':
					return <ImageNew />;
				case 'video':
					return <VideoNew />;
				case 'lists':
					return <ListNew />;
				case 'gallery':
					return <GalleryNew />;
				case 'footer':
					return <FooterNew />;
				case 'embed':
					return <EmbedNew />;
				case 'journey':
					return <JourneyNew />;
				case 'services':
					return <ServiceNew />;
				case 'events':
					return <EventsNew />;
				case 'form':
					return <FormNew />;

				case 'invoice':
					return <InvoiceNew />;
				case 'contract':
					return <ContractNew />;
				case 'accept':
					return <AcceptNew />;
				case 'table':
					return <NewTable />;
				case 'summary':
					return <SummaryNew />;
				case 'scheduler':
					return <SchedulerNew />;
				default:
					return null;
			}
		};

		return (
			<div className="add_block_v2">
				<div
					className="ab-l"
					style={{ marginTop: this.state.tabsclicked ? '31px' : '0px' }}
				>
					<div
						className="ab-l-top"
						style={{ marginTop: this.state.scroolCalled ? '0px' : '27px' }}
					>
						{/* {this.state.isElement !== true && (
                            <div
                                className={`addBlank ${this.state.activeTab === 'fluid' ? 'active' : ''
                                    }`}
                                onClick={(e) => {
                                    this.props.handleAddLayout(null, true);
                                    this.setState({
                                        activeTab: 'fluid',
                                        showRightBar: true,
                                        tabsclicked: true,
                                    });
                                }}
                                data-tab="fluid"
                            >
                                <AddBlank />
                            </div>
                        )} */}

						<Divider />
						{this.sections.map((section) => (
							<React.Fragment key={section.name}>
								<Tooltip placement="right" title={section.title}>
									<div
										className={`addBlank ${
											this.state.activeTab === section.name ? 'active' : ''
										}`}
										onClick={() => this.scrollToSection(section.name)}
									>
										{getSectionIcon(section.name)}
									</div>
								</Tooltip>
								{section.name === 'form' && !this.state.isFormTemplate && (
									<Divider />
								)}
							</React.Fragment>
						))}
					</div>
				</div>

				<div
					className={`ab-r ${this.state.showRightBar ? 'show' : ''}`}
					style={{ marginTop: this.state.tabsclicked ? '31px' : '0px' }}
				>
					<div
						className="ab-r-top"
						style={{ marginTop: this.state.scroolCalled ? '0px' : '27px' }}
					>
						<div>{this.state.activeTab}</div>
						<div className="divider" />
					</div>
					<div className="ab-r-bottom">
						{this.sections.map((section) => (
							<div key={section.name}>{this.renderSection(section)}</div>
						))}
					</div>
					{this.state.hoverImage && (
						<div className="hovered-image-preview">
							<img src={this.state.hoverImage} alt="Hovered Preview" />
						</div>
					)}
				</div>
			</div>
		);
	}
}

export default AddBlockV2;
