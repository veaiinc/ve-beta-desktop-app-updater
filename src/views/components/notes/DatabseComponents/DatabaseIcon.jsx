import { memo } from 'react';
import { ReactComponent as Text } from '../../../../assets/svg/notes/database/text.svg';
import { ReactComponent as Number } from '../../../../assets/svg/notes/database/number.svg';
import { ReactComponent as Status } from '../../../../assets/svg/notes/database/status.svg';
import { ReactComponent as CheckBox } from '../../../../assets/svg/notes/database/checkBox.svg';
import { ReactComponent as Select } from '../../../../assets/svg/notes/database/select.svg';
import { ReactComponent as MultiSelect } from '../../../../assets/svg/notes/database/tags.svg';
import { ReactComponent as Date } from '../../../../assets/svg/notes/database/calendar.svg';
import { ReactComponent as PaperClip } from '../../../../assets/svg/notes/database/paperClip.svg';
import { ReactComponent as Phone } from '../../../../assets/svg/notes/database/phone.svg';
import { ReactComponent as Link } from '../../../../assets/svg/notes/database/link.svg';
import { ReactComponent as Persons } from '../../../../assets/svg/notes/database/persons.svg';
import { ReactComponent as SinglePerson } from '../../../../assets/svg/notes/database/person.svg';
import { ReactComponent as CreatedClock } from '../../../../assets/svg/notes/database/createdClock.svg';
import { ReactComponent as LastEditClock } from '../../../../assets/svg/notes/database/lastEditClock.svg';
import { ReactComponent as Mail } from '../../../../assets/svg/notes/database/mail.svg';

export const databaseIcons = {
	text: Text,
	title: Text,
	number: Number,
	status: Status,
	checkbox: CheckBox,
	select: Select,
	multi_select: MultiSelect,
	date: Date,
	email: Mail,
	phone: Phone,
	url: Link,
	person: Persons,
	created_by: SinglePerson,
	last_edited_by: SinglePerson,
	created_time: CreatedClock,
	last_edited_time: LastEditClock,
	serial_number: Number,
};

const DatabaseIcon = ({ type, ...props }) => {
	const Icon = databaseIcons?.[type];
	return Icon ? <Icon {...props} /> : null;
};

export default memo(DatabaseIcon);
