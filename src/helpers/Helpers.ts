// @ts-nocheck
import dompurify from 'dompurify';
import { getObjLength } from './ObjectHelper';
import htmlToFormattedText from 'html-to-formatted-text';

export const isString = (anyVar) => {
	return typeof anyVar === 'string';
};

export const isEmptyString = (str) => {
	return !str || str.length === 0;
};

export const translateHTMLInputToText = (html) => {
	let result;
	const reg = new RegExp(
		'<img\\s[^>]*?src\\s*=\\s*[\'\\"]([^\'\\"]*?)[\'\\"][^>]*?>',
		'g'
	);
	result = html.replace(reg, function (occurrences) {
		// Extract unicode from aria-label
		const matches = occurrences.match(
			new RegExp('aria-label="\\s*(.*?)\\s*,'),
			'$1'
		);
		if (matches && matches.length >= 1) {
			return matches[1];
		}
		return '';
	});

	// Convert it to plain text
	result = htmlToFormattedText(result);

	return result;
};

export const generateInitialsHelper = (name) => {
	return (
		name ? name.replace(/[^a-z\d\s]+/gi, '').trim()[0] : ''
	)?.toUpperCase();
};

export const generateUnixTimestamp = () => {
	return Math.round(+new Date() / 1000);
};

export const stringContainsAnyInArray = (string, array) => {
	for (let i = 0; i < array.length; i++) {
		if (string.includes(array[i])) {
			return true;
		}
	}

	return false;
};

export const getSelectionHtml = () => {
	let html = '';
	if (typeof window.getSelection != 'undefined') {
		const sel = window.getSelection();
		if (sel.rangeCount) {
			const container = document.createElement('div');
			for (let i = 0, len = sel.rangeCount; i < len; ++i) {
				container.appendChild(sel.getRangeAt(i).cloneContents());
			}
			html = container.innerHTML;
		}
	} else if (typeof document.selection != 'undefined') {
		if (document.selection.type === 'Text') {
			html = document.selection.createRange().htmlText;
		}
	}
	return html;
};

export const displaySeconds = (seconds) => {
	const format = (val) => `0${Math.floor(val)}`.slice(-2);
	//const hours = seconds / 3600;
	const minutes = (seconds % 3600) / 60;

	return [minutes, seconds % 60].map(format).join(':');
};

export const containsLetters = (text) => {
	const regExp = /[a-zA-Z]/g;
	return regExp.test(text);
};

export const extractAvatarFromContactProviderData = (
	contactProviderData: any,
	isLarge?: boolean
) => {
	if (contactProviderData) {
		for (let i = 0; i < getObjLength(contactProviderData); i++) {
			const data = contactProviderData[i];
			if (data?.avatar) {
				return isLarge === true && data?.large_avatar
					? data.large_avatar
					: data.avatar;
			}
		}
	}

	return undefined;
};

export const hasInternetConnection = () => {
	return navigator.onLine;
};

export const sortMessagesAsc = (messages) => {
	let sortedNextState = Object.entries(messages).sort(
		(a, b) => a[1].timestamp - b[1].timestamp
	);
	return Object.fromEntries(sortedNextState);
};

export const isScrollable = (el) => {
	const hasScrollableContent = el.scrollHeight > el.clientHeight;
	const overflowYStyle = window.getComputedStyle(el).overflowY;
	const isOverflowHidden = overflowYStyle.indexOf('hidden') !== -1;

	return hasScrollableContent && !isOverflowHidden;
};

export const sanitize = (dirty) => {
	if (!dirty) return;
	const sanitizer = dompurify.sanitize;
	return sanitizer(dirty);
};

export const generateUniqueID = () => {
	return `${Date.now()}-${Math.floor(Math.random() * (9e12 - 1)) + 1e12}`;
};
