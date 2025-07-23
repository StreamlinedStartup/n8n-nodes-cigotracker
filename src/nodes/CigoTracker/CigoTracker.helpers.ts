import {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IHttpRequestOptions,
	IHttpRequestMethods,
	IDataObject,
	NodeApiError,
} from 'n8n-workflow';
import { CigoTrackerCredentials } from '../../types/CigoTracker.types';

export async function cigoTrackerApiRequest(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<any> {
	const credentials = await this.getCredentials('cigoTrackerApi') as unknown as CigoTrackerCredentials;

	const baseUrl = credentials.environment === 'production'
		? 'https://app.cigotracker.com'
		: 'https://app-demo.cigotracker.com';

	const options: IHttpRequestOptions = {
		method,
		url: `${baseUrl}/api/v1${endpoint}`,
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		auth: {
			username: credentials.apiAccountId,
			password: credentials.apiAuthKey,
		},
		body,
		qs,
		json: true,
	};

	// Remove empty body for GET and DELETE requests
	if (method === 'GET' || method === 'DELETE') {
		delete options.body;
	}
	
	// Only include body if it has content
	if (options.body && Object.keys(options.body).length === 0) {
		delete options.body;
	}

	try {
		return await this.helpers.httpRequest(options);
	} catch (error: any) {
		console.error('CigoTracker API Error:', error);
		if (error.response) {
			console.error('Response data:', error.response.data);
			console.error('Response status:', error.response.status);
		}
		throw new NodeApiError(this.getNode(), error, {
			message: `CigoTracker API request failed: ${error.message || 'Unknown error'}`,
		});
	}
}

export function formatDateForApi(date: string): string {
	// Ensure date is in YYYY-MM-DD format
	const dateObj = new Date(date);
	return dateObj.toISOString().split('T')[0];
}

export function validateTimeFrame(timeFrame: any): boolean {
	if (!timeFrame || typeof timeFrame !== 'object') {
		return false;
	}
	if (!timeFrame.start || !timeFrame.end) {
		return false;
	}
	// Validate time format (HH:MM)
	const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
	return timeRegex.test(timeFrame.start) && timeRegex.test(timeFrame.end);
}

export function parseCoordinates(coordinates: string): [number, number] | undefined {
	try {
		// Accept formats: "lat,lng" or "[lat,lng]"
		const cleaned = coordinates.replace(/[\[\]]/g, '').trim();
		const parts = cleaned.split(',').map(p => parseFloat(p.trim()));
		
		if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
			return [parts[0], parts[1]];
		}
	} catch (error) {
		// Invalid format
	}
	return undefined;
}