// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import '../../../styles/BusinessProfile.css';
import {
	Button,
	FormControl,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { generateInitialsHelper } from '@src/helpers/Helpers';
import FileInput from '../../FileInput';
import { useTranslation } from 'react-i18next';
import { ApplicationContext } from '@src/contexts/ApplicationContext';
import { generateCancelToken } from '@src/helpers/ApiHelper';
import { binaryToBase64 } from '@src/helpers/ImageHelper';
import CustomAvatar from '@src/components/CustomAvatar';
import { useAppSelector } from '@src/store/hooks';

function BusinessProfile(props) {
	const { apiService } = React.useContext(ApplicationContext);

	const currentUser = useAppSelector((state) => state.currentUser.value);
	const isAdmin = currentUser?.isAdmin ?? false;

	const { t } = useTranslation();

	const [isLoaded, setLoaded] = useState(false);
	const [isUpdating, setUpdating] = useState(false);
	const [address, setAddress] = useState('');
	const [description, setDescription] = useState('');
	const [email, setEmail] = useState('');
	const [vertical, setVertical] = useState('');
	const [websites, setWebsites] = useState({});
	const [about, setAbout] = useState('');
	const [profilePhoto, setProfilePhoto] = useState();

	const fileInput = useRef();

	const cancelTokenSourceRef = useRef();

	useEffect(() => {
		const handleKey = (event) => {
			if (event.key === 'Escape') {
				// Escape
				props.onHide();
			}
		};

		document.addEventListener('keydown', handleKey);

		// Generate a token
		cancelTokenSourceRef.current = generateCancelToken();

		retrieveBusinessProfile();

		return () => {
			document.removeEventListener('keydown', handleKey);
			cancelTokenSourceRef.current.cancel();
		};
	}, []);

	const retrieveBusinessProfile = () => {
		apiService.retrieveBusinessProfileCall(
			cancelTokenSourceRef.current.token,
			(response) => {
				const data = response.data;

				setAddress(data.address);
				setDescription(data.description);
				setEmail(data.email);
				setVertical(data.vertical);

				let websitesArray = data.websites;
				if (websitesArray.length === 0) {
					websitesArray = [];
				}

				setWebsites({ ...websitesArray });

				// Load about
				retrieveProfileAbout();
			}
		);
	};

	const updateBusinessProfile = async (event) => {
		event.preventDefault();

		setUpdating(true);

		apiService.updateBusinessProfileCall(
			address,
			description,
			email,
			vertical,
			Object.values(websites),
			cancelTokenSourceRef.current.token,
			(response) => {
				updateProfileAbout(event);
			},
			(error) => {
				setUpdating(false);
			}
		);
	};

	const retrieveProfileAbout = () => {
		apiService.retrieveProfileAboutCall(
			cancelTokenSourceRef.current.token,
			(response) => {
				const profile = response.data.settings?.profile;
				setAbout(profile?.about?.text);
				retrieveProfilePhoto();
			}
		);
	};

	const updateProfileAbout = async (event) => {
		event.preventDefault();

		apiService.updateProfileAboutCall(
			about,
			cancelTokenSourceRef.current.token,
			(response) => {
				setUpdating(false);
			},
			(error) => {
				setUpdating(false);
			}
		);
	};

	const retrieveProfilePhoto = () => {
		apiService.retrieveProfilePhotoCall(
			cancelTokenSourceRef.current.token,
			(response) => {
				const base64 = binaryToBase64(response.data);
				setProfilePhoto(base64);

				// Finish
				setLoaded(true);
			},
			(error) => {
				// No photo
				if (error?.response?.status === 404) {
					// Finish
					setLoaded(true);
				} else if (error?.response?.status === 503) {
					window.displayCustomError(
						error.response.data?.reason ?? 'An error has occurred.'
					);
				} else {
					window.displayError(error);
				}
			}
		);
	};

	const updateProfilePhoto = async (file) => {
		const formData = new FormData();
		formData.append('file_encoded', file[0]);

		apiService.updateProfilePhotoCall(
			formData,
			cancelTokenSourceRef.current.token,
			(response) => {
				setUpdating(false);

				// Display new photo
				retrieveProfilePhoto();
			},
			(error) => {
				setUpdating(false);
			}
		);
	};

	const deleteProfilePhoto = () => {
		apiService.deleteProfilePhotoCall(
			cancelTokenSourceRef.current.token,
			(response) => {
				setProfilePhoto(undefined);
			}
		);
	};

	const verticalOptions = [
		'Automotive',
		'Beauty, Spa and Salon',
		'Clothing and Apparel',
		'Education',
		'Entertainment',
		'Event Planning and Service',
		'Finance and Banking',
		'Food and Grocery',
		'Public Service',
		'Hotel and Lodging',
		'Medical and Health',
		'Non-profit',
		'Professional Services',
		'Shopping and Retail',
		'Travel and Transportation',
		'Restaurant',
		'Other',
	];

	const handleBusinessProfileAvatarClick = () => {
		if (isAdmin) fileInput.current.click();
	};

	return (
		<div className="sidebarBusinessProfile">
			<div className="sidebarBusinessProfile__header">
				<IconButton onClick={props.onHide} size="large">
					<ArrowBack />
				</IconButton>

				<h3>{t('Profile')}</h3>
			</div>

			<div className="sidebarBusinessProfile__body">
				<div className="sidebarBusinessProfile__body__section">
					{currentUser && (
						<div>
							<div className="sidebarBusinessProfile__body__section__header">
								<h5>{t('Personal Profile')}</h5>
							</div>

							<div className="sidebarBusinessProfile__body__avatarContainer">
								<CustomAvatar
									src={
										currentUser?.profile?.large_avatar ??
										currentUser?.profile?.avatar
									}
									generateBgColorBy={currentUser.username}
								>
									{generateInitialsHelper(currentUser.username)}
								</CustomAvatar>
							</div>

							<h3>{currentUser.username}</h3>
							<span>{currentUser.firstName + ' ' + currentUser.lastName}</span>

							<div className="sidebarBusinessProfile__body__changePasswordContainer">
								<Button
									onClick={() => props.setChangePasswordDialogVisible(true)}
									color="secondary"
								>
									{t('Change password')}
								</Button>
							</div>
						</div>
					)}
				</div>

				<div className="sidebarBusinessProfile__body__section">
					<div className="sidebarBusinessProfile__body__section__header">
						<h5>{t('Business Profile')}</h5>
					</div>

					{!isLoaded && <span>{t('Loading')}</span>}

					{isLoaded && (
						<div className="sidebarBusinessProfile__body__section__subSection">
							<div
								className={
									'sidebarBusinessProfile__body__avatarContainer' +
									(isAdmin ? ' editable' : '')
								}
							>
								<FileInput
									innerRef={fileInput}
									handleSelectedFiles={(file) => updateProfilePhoto(file)}
									accept="image/jpeg, image/png"
									multiple={false}
								/>
								<CustomAvatar
									src={
										profilePhoto
											? 'data:image/png;base64,' + profilePhoto
											: undefined
									}
									onClick={handleBusinessProfileAvatarClick}
								/>

								{profilePhoto && (
									<div
										className={
											'sidebarBusinessProfile__body__avatarContainer__info'
										}
									>
										{t(
											'On WhatsApp, your business profile photo has bigger resolution than shown here.'
										)}
									</div>
								)}

								{profilePhoto && isAdmin && (
									<Button onClick={deleteProfilePhoto} color="secondary">
										Delete profile photo
									</Button>
								)}
							</div>

							<form onSubmit={updateBusinessProfile}>
								<div>
									<TextField
										variant="standard"
										value={about}
										onChange={(e) => setAbout(e.target.value)}
										label={t('About')}
										size="medium"
										multiline={true}
										fullWidth={true}
										InputProps={{
											readOnly: !isAdmin,
										}}
									/>
									<TextField
										variant="standard"
										value={address}
										onChange={(e) => setAddress(e.target.value)}
										label={t('Address')}
										size="medium"
										fullWidth={true}
										InputProps={{
											readOnly: !isAdmin,
										}}
									/>
									<TextField
										variant="standard"
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										label={t('Description')}
										size="medium"
										fullWidth={true}
										InputProps={{
											readOnly: !isAdmin,
										}}
									/>
									<TextField
										variant="standard"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										label={t('E-mail')}
										size="medium"
										fullWidth={true}
										InputProps={{
											readOnly: !isAdmin,
										}}
									/>

									<FormControl
										variant="standard"
										fullWidth={true}
										disabled={!isAdmin}
									>
										<InputLabel id="vertical-label">{t('Vertical')}</InputLabel>
										<Select
											variant="standard"
											value={vertical}
											onChange={(event) => setVertical(event.target.value)}
											labelId="vertical-label"
										>
											<MenuItem value="">{t('None')}</MenuItem>

											{verticalOptions.map((verticalOption, index) => (
												<MenuItem key={index} value={verticalOption}>
													{verticalOption}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</div>

								{isAdmin && (
									<div className="sidebarBusinessProfile__body__section__subSection__action">
										<Button
											type="submit"
											disabled={isUpdating}
											color="primary"
											size="large"
										>
											{t('Update')}
										</Button>
									</div>
								)}
							</form>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default BusinessProfile;
