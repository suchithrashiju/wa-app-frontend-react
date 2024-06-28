// @ts-nocheck
import React from 'react';
import { sortTemplateComponents } from '../helpers/TemplateMessageHelper';
import { Button } from '@mui/material';
import { getObjLength } from '../helpers/ObjectHelper';
import { useTranslation } from 'react-i18next';
import useTemplates from '@src/hooks/useTemplates';
import { useAppSelector } from '@src/store/hooks';

const TemplatesList = ({
	onClick,
	customSelectButtonTitle,
	displayRegisterTemplate,
	isTemplatesFailed,
}) => {
	const { t } = useTranslation();

	const templates = useAppSelector((state) => state.templates.value);

	const { issueTemplateRefreshRequest } = useTemplates();

	const isRefreshingTemplates = useAppSelector(
		(state) => state.isRefreshingTemplates.value
	);

	const doRefreshTemplates = async () => {
		await issueTemplateRefreshRequest();
	};

	return (
		<div className="templateMessagesWrapper">
			<div className="templateMessages" data-test-id="template-messages">
				<div className="templateMessages__actions">
					<div className="templateMessages__create">
						{displayRegisterTemplate && (
							<Button
								color="black"
								href="https://hub.360dialog.com/dashboard/home"
								target="_blank"
								size="small"
							>
								{t('Register templates')}
							</Button>
						)}
					</div>

					<div className="templateMessages__refresh">
						{isRefreshingTemplates ? (
							<span>Refreshing templates...</span>
						) : (
							<>
								<span>{t('Not seeing your new templates?')}</span>
								<a onClick={doRefreshTemplates} href="#">
									{t('Click here to refresh')}
								</a>
							</>
						)}
					</div>
				</div>

				{getObjLength(templates) === 0 && (
					<div className="templateMessages__emptyInfo mt-3">
						{isTemplatesFailed ? (
							<span>{t("Template messages couldn't be loaded.")}</span>
						) : (
							<span>{t('No templates have been registered yet.')}</span>
						)}
					</div>
				)}

				{Object.entries(templates).map((template) => (
					<div key={template[0]} className="templateMessageWrapper">
						<div className="chat__message chat__outgoing messageType__template">
							{/*<span className={"templateMessage__status " + template[1].status}>{template[1].status}</span>*/}
							<div className="templateMessage__message">
								<h4>{template[1].name}</h4>
								{sortTemplateComponents(template[1].components).map(
									(comp, index) => (
										<div key={index}>
											<span className="templateType bold lowercase">
												{comp.type}:
											</span>{' '}
											{comp.text ?? comp.format ?? JSON.stringify(comp.buttons)}
										</div>
									)
								)}
							</div>
						</div>
						{template[1].status === 'approved' && (
							<Button onClick={() => onClick?.(template[1])} color="black">
								{customSelectButtonTitle ?? t('Send')}
							</Button>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default TemplatesList;
