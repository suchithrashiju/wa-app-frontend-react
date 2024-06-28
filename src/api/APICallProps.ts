import { AxiosError, AxiosResponse, CancelToken } from 'axios';

interface APICallProps {
	cancelToken?: CancelToken;
	onSuccess?: (response: AxiosResponse) => void;
	onError?: (error: AxiosError) => void;
}

export default APICallProps;
