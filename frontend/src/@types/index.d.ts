import { AxiosError } from "axios";

type AxiosResponseError = {
	message: string;
	error: string;
	statusCode: number;
};

export interface IAxiosError extends AxiosError<AxiosResponseError> {}
