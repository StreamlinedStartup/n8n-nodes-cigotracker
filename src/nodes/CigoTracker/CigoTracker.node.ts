import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeApiError,
} from 'n8n-workflow';

import { cigoTrackerApiRequest } from './CigoTracker.helpers';
import { jobFields, jobOperations } from './descriptions/JobDescription';
import { actionFields, actionOperations } from './descriptions/ActionDescription';
import { itineraryFields, itineraryOperations } from './descriptions/ItineraryDescription';
import { locationFields, locationOperations } from './descriptions/LocationDescription';
import { vehicleFields, vehicleOperations } from './descriptions/VehicleDescription';
import { operatorFields, operatorOperations } from './descriptions/OperatorDescription';

function buildJobBody(this: IExecuteFunctions, itemIndex: number): any {
	const body: any = {
		skip_staging: this.getNodeParameter('skipStaging', itemIndex),
		first_name: this.getNodeParameter('firstName', itemIndex),
		last_name: this.getNodeParameter('lastName', itemIndex),
		address: this.getNodeParameter('address', itemIndex),
		date: this.getNodeParameter('date', itemIndex),
	};

	const additionalFields = this.getNodeParameter('additionalFields', itemIndex) as any;
	
	// Handle time frame if present
	if (additionalFields.time_frame?.timeFrame?.[0]) {
		body.time_frame = {
			start: additionalFields.time_frame.timeFrame[0].start,
			end: additionalFields.time_frame.timeFrame[0].end,
		};
		delete additionalFields.time_frame;
	}
	
	// Handle coordinates if present
	if (additionalFields.coordinates) {
		const coords = additionalFields.coordinates.split(',').map((c: string) => parseFloat(c.trim()));
		if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
			body.coordinates = coords;
		}
		delete additionalFields.coordinates;
	}
	
	Object.assign(body, additionalFields);
	return body;
}

function buildActionBody(this: IExecuteFunctions, itemIndex: number): any {
	const body: any = {
		type: this.getNodeParameter('type', itemIndex),
	};

	const additionalFields = this.getNodeParameter('additionalFields', itemIndex) as any;
	
	// Parse custom fields if present
	if (additionalFields.custom_fields) {
		try {
			additionalFields.custom_fields = JSON.parse(additionalFields.custom_fields);
		} catch (e) {
			delete additionalFields.custom_fields;
		}
	}
	
	Object.assign(body, additionalFields);
	return body;
}

function buildItineraryBody(this: IExecuteFunctions, itemIndex: number): any {
	const body: any = {
		name: this.getNodeParameter('name', itemIndex),
		date: this.getNodeParameter('date', itemIndex),
	};

	const additionalFields = this.getNodeParameter('additionalFields', itemIndex) as any;
	
	// Handle operator IDs if present
	if (additionalFields.operator_ids) {
		additionalFields.operator_ids = additionalFields.operator_ids.split(',').map((id: string) => id.trim());
	}
	
	// Parse jobs array if present
	if (additionalFields.jobs) {
		try {
			additionalFields.jobs = JSON.parse(additionalFields.jobs);
		} catch (e) {
			delete additionalFields.jobs;
		}
	}
	
	Object.assign(body, additionalFields);
	return body;
}

export class CigoTracker implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'CigoTracker',
		name: 'cigoTracker',
		icon: 'file:Cigo-Logo.png',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with CigoTracker API',
		defaults: {
			name: 'CigoTracker',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'cigoTrackerApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Job',
						value: 'job',
						description: 'Create, read, update, and delete jobs',
					},
					{
						name: 'Action',
						value: 'action',
						description: 'Manage job actions',
					},
					{
						name: 'Itinerary',
						value: 'itinerary',
						description: 'Manage itineraries and routes',
					},
					{
						name: 'Location',
						value: 'location',
						description: 'Retrieve location information',
					},
					{
						name: 'Vehicle',
						value: 'vehicle',
						description: 'Retrieve vehicle information',
					},
					{
						name: 'Operator',
						value: 'operator',
						description: 'Retrieve operator information',
					},
				],
				default: 'job',
			},
			// Job operations and fields
			...jobOperations,
			...jobFields,
			// Action operations and fields
			...actionOperations,
			...actionFields,
			// Itinerary operations and fields
			...itineraryOperations,
			...itineraryFields,
			// Location operations and fields
			...locationOperations,
			...locationFields,
			// Vehicle operations and fields
			...vehicleOperations,
			...vehicleFields,
			// Operator operations and fields
			...operatorOperations,
			...operatorFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		
		// If no items, still process at least once
		if (items.length === 0) {
			items.push({ json: {} });
		}
		
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData;

				if (resource === 'job') {
					// Job operations
					if (operation === 'ping') {
						responseData = await cigoTrackerApiRequest.call(this, 'GET', '/ping');
					} else if (operation === 'create') {
						const body = buildJobBody.call(this, i);
						responseData = await cigoTrackerApiRequest.call(this, 'POST', '/jobs', body);
					} else if (operation === 'get') {
						const jobId = this.getNodeParameter('jobId', i) as string;
						responseData = await cigoTrackerApiRequest.call(this, 'GET', `/jobs/id/${jobId}`);
					} else if (operation === 'update') {
						const jobId = this.getNodeParameter('jobId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as any;
						responseData = await cigoTrackerApiRequest.call(this, 'PUT', `/jobs/id/${jobId}`, updateFields);
					} else if (operation === 'delete') {
						const jobId = this.getNodeParameter('jobId', i) as string;
						responseData = await cigoTrackerApiRequest.call(this, 'DELETE', `/jobs/id/${jobId}`);
					} else if (operation === 'search') {
						const searchFields = this.getNodeParameter('searchFields', i) as any;
						responseData = await cigoTrackerApiRequest.call(this, 'POST', '/jobs/search', searchFields);
					} else if (operation === 'cancel') {
						const jobId = this.getNodeParameter('jobId', i) as string;
						responseData = await cigoTrackerApiRequest.call(this, 'POST', `/jobs/id/${jobId}/cancel`);
					}
				} else if (resource === 'action') {
					// Action operations
					const jobId = this.getNodeParameter('jobId', i) as string;
					
					if (operation === 'create') {
						const body = buildActionBody.call(this, i);
						responseData = await cigoTrackerApiRequest.call(this, 'POST', `/jobs/id/${jobId}/actions`, body);
					} else if (operation === 'get') {
						const actionId = this.getNodeParameter('actionId', i) as string;
						responseData = await cigoTrackerApiRequest.call(this, 'GET', `/jobs/id/${jobId}/actions/${actionId}`);
					} else if (operation === 'getAll') {
						responseData = await cigoTrackerApiRequest.call(this, 'GET', `/jobs/id/${jobId}/actions`);
					} else if (operation === 'update') {
						const actionId = this.getNodeParameter('actionId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as any;
						responseData = await cigoTrackerApiRequest.call(this, 'PUT', `/jobs/id/${jobId}/actions/${actionId}`, updateFields);
					} else if (operation === 'delete') {
						const actionId = this.getNodeParameter('actionId', i) as string;
						responseData = await cigoTrackerApiRequest.call(this, 'DELETE', `/jobs/id/${jobId}/actions/${actionId}`);
					}
				} else if (resource === 'itinerary') {
					// Itinerary operations
					if (operation === 'create') {
						const body = buildItineraryBody.call(this, i);
						responseData = await cigoTrackerApiRequest.call(this, 'POST', '/itineraries', body);
					} else if (operation === 'get') {
						const itineraryId = this.getNodeParameter('itineraryId', i) as string;
						responseData = await cigoTrackerApiRequest.call(this, 'GET', `/itineraries/id/${itineraryId}`);
					} else if (operation === 'getByDate') {
						const date = this.getNodeParameter('date', i) as string;
						responseData = await cigoTrackerApiRequest.call(this, 'GET', `/itineraries/date/${date}`);
					} else if (operation === 'getByOperator') {
						const operatorId = this.getNodeParameter('operatorId', i) as string;
						responseData = await cigoTrackerApiRequest.call(this, 'GET', `/itineraries/operator/${operatorId}`);
					} else if (operation === 'getByVehicle') {
						const vehicleId = this.getNodeParameter('vehicleId', i) as string;
						responseData = await cigoTrackerApiRequest.call(this, 'GET', `/itineraries/vehicle/${vehicleId}`);
					} else if (operation === 'update') {
						const itineraryId = this.getNodeParameter('itineraryId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as any;
						responseData = await cigoTrackerApiRequest.call(this, 'PUT', `/itineraries/id/${itineraryId}`, updateFields);
					} else if (operation === 'delete') {
						const itineraryId = this.getNodeParameter('itineraryId', i) as string;
						responseData = await cigoTrackerApiRequest.call(this, 'DELETE', `/itineraries/id/${itineraryId}`);
					} else if (operation === 'previewRoute') {
						const previewFields = this.getNodeParameter('previewFields', i) as any;
						responseData = await cigoTrackerApiRequest.call(this, 'POST', '/itineraries/action/previewRoute', previewFields);
					} else if (operation === 'addJob') {
						const itineraryId = this.getNodeParameter('itineraryId', i) as string;
						const jobId = this.getNodeParameter('jobId', i) as string;
						responseData = await cigoTrackerApiRequest.call(this, 'POST', `/itineraries/id/${itineraryId}/job_id/${jobId}`);
					} else if (operation === 'removeJob') {
						const itineraryId = this.getNodeParameter('itineraryId', i) as string;
						const jobId = this.getNodeParameter('jobId', i) as string;
						responseData = await cigoTrackerApiRequest.call(this, 'DELETE', `/itineraries/id/${itineraryId}/job_id/${jobId}`);
					} else if (operation === 'updateJobPosition') {
						const itineraryId = this.getNodeParameter('itineraryId', i) as string;
						const jobId = this.getNodeParameter('jobId', i) as string;
						const position = this.getNodeParameter('position', i) as number;
						responseData = await cigoTrackerApiRequest.call(this, 'PUT', `/itineraries/id/${itineraryId}/job_id/${jobId}/position/${position}`);
					}
				} else if (resource === 'location') {
					// Location operations
					if (operation === 'get') {
						const locationId = this.getNodeParameter('locationId', i) as string;
						responseData = await cigoTrackerApiRequest.call(this, 'GET', `/locations/id/${locationId}`);
					} else if (operation === 'getAll') {
						responseData = await cigoTrackerApiRequest.call(this, 'GET', '/locations');
					}
				} else if (resource === 'vehicle') {
					// Vehicle operations
					if (operation === 'get') {
						const vehicleId = this.getNodeParameter('vehicleId', i) as string;
						responseData = await cigoTrackerApiRequest.call(this, 'GET', `/vehicles/id/${vehicleId}`);
					} else if (operation === 'getAll') {
						responseData = await cigoTrackerApiRequest.call(this, 'GET', '/vehicles');
					}
				} else if (resource === 'operator') {
					// Operator operations
					if (operation === 'get') {
						const operatorId = this.getNodeParameter('operatorId', i) as string;
						responseData = await cigoTrackerApiRequest.call(this, 'GET', `/operators/id/${operatorId}`);
					} else if (operation === 'getAll') {
						responseData = await cigoTrackerApiRequest.call(this, 'GET', '/operators');
					}
				}

				// Handle response data
				if (responseData === undefined || responseData === null) {
					returnData.push({ 
						json: { message: 'No data returned' },
						pairedItem: { item: i },
					});
				} else if (Array.isArray(responseData)) {
					returnData.push(...responseData.map(item => ({ 
						json: item,
						pairedItem: { item: i },
					})));
				} else {
					returnData.push({ 
						json: responseData,
						pairedItem: { item: i },
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error';
					const errorDetails = error instanceof NodeApiError ? error.description : '';
					returnData.push({ 
						json: { 
							error: errorMessage,
							details: errorDetails,
							resource,
							operation,
						}, 
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}