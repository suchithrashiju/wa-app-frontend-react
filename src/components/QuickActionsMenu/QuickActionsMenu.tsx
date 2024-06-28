import React, { useEffect, useRef, useState } from 'react';
import styles from './QuickActionsMenu.module.css';
import useQuickActionsMenu from '@src/components/QuickActionsMenu/useQuickActionsMenu';
import QuickActionItem from '@src/components/QuickActionItem';
import useNavigateList from 'react-use-navigate-list';
import { useTranslation } from 'react-i18next';
import { QuickActionType } from '@src/components/QuickActionItem/QuickActionType';
import { isEmptyString } from '@src/helpers/Helpers';
import { SearchOutlined } from '@mui/icons-material';
import { ClickAwayListener } from '@mui/material';

export type Props = {
	input: string;
	setInput: (text?: string) => void;
	setVisible: (isVisible: boolean) => void;
	onProcessCommand: (text?: string) => void;
	isExpired: boolean;
};

const QuickActionsMenu: React.FC<Props> = ({
	input,
	setInput,
	setVisible,
	onProcessCommand,
	isExpired,
}) => {
	const { t } = useTranslation();

	const [commandInput, setCommandInput] = useState('');

	const { data, generateCommandString } = useQuickActionsMenu({
		input: commandInput,
		isExpired,
	});

	const close = () => {
		setVisible(false);
	};

	const inputRef = useRef<HTMLInputElement>();
	const resultsRef = useRef<HTMLDivElement>();

	useEffect(() => {
		// Clear message input on start
		if (input.startsWith('/')) {
			setInput('');
		}
	}, []);

	useEffect(() => {
		inputRef.current?.focus();
	}, [inputRef.current]);

	const handleItemRun = (item?: QuickActionType) => {
		if (!item) return;

		// Running it in setTimeout to avoid incorrect click outside detections
		setTimeout(() => {
			const commandString = generateCommandString(item);
			if (item.customActionCommand) {
				onProcessCommand(item.customActionCommand);
				close();
			} else if (item.runCommand) {
				onProcessCommand(commandString);
				close();
			} else {
				setCommandInput(commandString + ' ');
				inputRef.current?.focus();
			}
		}, 0);
	};

	const { activeIndex, itemProps } = useNavigateList({
		list: data,
		onSelect: handleItemRun,
		indexPath: 'id',
	});

	const handleSearchInputKeyDown = (e: React.KeyboardEvent) => {
		// Prevent cursor from moving when navigating between commands
		switch (e.code) {
			case 'ArrowUp':
			case 'ArrowDown':
				e.preventDefault();
				break;
			case 'Backspace':
				if (isEmptyString(commandInput)) {
					close();
				}
				break;
			case 'Escape':
				close();
				break;
		}
	};

	const handleSearchInputKeyUp = (e: React.KeyboardEvent) => {
		// Prevent cursor from moving when navigating between commands
		if (['ArrowUp', 'ArrowDown'].indexOf(e.code) > -1) {
			e.preventDefault();

			setTimeout(() => {
				resultsRef.current
					?.getElementsByClassName('active')[0]
					?.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}, 0);
		}
	};

	return (
		<ClickAwayListener onClickAway={close}>
			<div className={styles.container}>
				<div className={styles.searchContainer}>
					<SearchOutlined className={styles.searchIcon} />
					<input
						type="text"
						placeholder={t('Search quick actions')}
						value={commandInput}
						onChange={(e) => setCommandInput(e.target.value)}
						onKeyDown={handleSearchInputKeyDown}
						onKeyUp={handleSearchInputKeyUp}
						className={styles.searchInput}
						// @ts-ignore
						ref={inputRef}
					/>
				</div>
				<div
					className={styles.results}
					// @ts-ignore
					ref={resultsRef}
					onKeyDown={(e) => e.preventDefault()}
					tabIndex={0}
				>
					{data.map((item, index) => (
						<QuickActionItem
							key={index}
							item={item}
							isSelected={index === activeIndex}
							itemProps={{ ...itemProps(item) }}
						/>
					))}

					{data.length === 0 && (
						<div className={styles.noResult}>{t('No results found.')}</div>
					)}
				</div>
			</div>
		</ClickAwayListener>
	);
};

export default QuickActionsMenu;
