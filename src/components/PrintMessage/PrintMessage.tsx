// @ts-nocheck
import React, { useMemo } from 'react';
import cn from 'classnames';

import emojiTree from 'emoji-tree';
import isEmoji from 'emoji-tree/lib/isEmoji';

import Text from './components/Text';
import HighlightText from './components/HighlightText';
import Emoji from './components/Emoji';

const getTextNodeType = (node) => {
	if (isEmoji(node)) {
		return {
			type: 'emoji',
			single: false,
			component: Emoji,
		};
	}

	if (node.match(/<mark class="highlight">(.*?)<\/mark>/gi)) {
		return {
			type: 'highlight',
			component: HighlightText,
		};
	}

	return {
		type: 'text',
		component: Text,
	};
};

const decomposeMessage = (message, highlightText) => {
	if (!message) return [];

	let section = '';

	if (highlightText) {
		const regex = new RegExp(
			highlightText.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'),
			'gi'
		);

		message = message
			.replace(regex, (match) => {
				return `<mark class="highlight">${match}</mark>`;
			})
			.replace(/\n/g, '<br />');
	}

	let splitWithEmoji = emojiTree(message).reduce((acc, item) => {
		if (item.type === 'emoji') {
			if (section) {
				acc.push(section);
				section = '';
			}

			acc.push(item.text);
		} else {
			section += item.text;
		}

		return acc;
	}, []);

	splitWithEmoji.push(section);
	section = '';

	const splitWithHighlight = [];

	splitWithEmoji.forEach((item) => {
		splitWithHighlight.push(
			item.split(/(<mark class="highlight">.*.<\/mark>)/gi)
		);
	});

	return []
		.concat(...splitWithHighlight)
		.filter((item) => item !== '')
		.map((item, index) => ({
			index,
			text: item,
			...getTextNodeType(item),
		}));
};

interface PrintMessageProps {
	message: string;
	as?: string;
	linkify?: boolean;
	smallEmoji?: boolean;
	highlightText?: boolean;
	className?: string;
}

const PrintMessage: React.FC<PrintMessageProps> = ({
	message,
	as: Tag = 'span',
	linkify = false,
	smallEmoji = false,
	highlightText = false,
	className,
}) => {
	const splitMessage = useMemo(
		() => decomposeMessage(message, highlightText),
		[message, highlightText]
	);
	const classNames = cn('printMessage', className);

	// single emoji
	if (splitMessage.length === 1 && splitMessage[0].type === 'emoji') {
		splitMessage[0].single = !smallEmoji;
	}

	return (
		<Tag className={classNames}>
			{splitMessage.map((item) => {
				const Component = item.component;

				return <Component data={item} key={item.index} linkify={linkify} />;
			})}
		</Tag>
	);
};

export default PrintMessage;
