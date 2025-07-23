import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	INodeProperties,
} from 'n8n-workflow';

import { cigoTrackerApiRequest } from './CigoTracker.helpers';

export class CigoTrackerWorking implements INodeType {
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
					},
					{
						name: 'Action',
						value: 'action',
					},
					{
						name: 'Itinerary',
						value: 'itinerary',
					},
					{
						name: 'Location',
						value: 'location',
					},
					{
						name: 'Vehicle',
						value: 'vehicle',
					},
					{
						name: 'Operator',
						value: 'operator',
					},
				],
				default: 'job',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['job'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new job',
						action: 'Create a job',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a job by ID',
						action: 'Get a job',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search for jobs',
						action: 'Search jobs',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a job',
						action: 'Update a job',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a job',
						action: 'Delete a job',
					},
					{
						name: 'Cancel',
						value: 'cancel',
						description: 'Cancel a job',
						action: 'Cancel a job',
					},
				],
				default: 'get',
			},
			// Job ID for get, update, delete, cancel operations
			{
				displayName: 'Job ID',
				name: 'jobId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['get', 'update', 'delete', 'cancel'],
					},
				},
				required: true,
				default: '',
				description: 'The ID of the job',
			},
			// Create operation fields
			{
				displayName: 'Skip Staging',
				name: 'skipStaging',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['create'],
					},
				},
				default: true,
				description: 'Whether to skip the staging area and create the job directly',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['create'],
					},
				},
				required: true,
				default: '',
				description: 'Customer first name',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Customer last name (optional)',
			},
			{
				displayName: 'Address',
				name: 'address',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['create'],
					},
				},
				required: true,
				default: '',
				description: 'Delivery address',
			},
			{
				displayName: 'Phone Number',
				name: 'phoneNumber',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['create'],
					},
				},
				required: true,
				default: '',
				description: 'Phone number associated with the job',
			},
			{
				displayName: 'Date',
				name: 'date',
				type: 'dateTime',
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['create'],
					},
				},
				required: true,
				default: '',
				description: 'Delivery date in YYYY-MM-DD format',
			},
			// Search operation fields
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['search'],
					},
				},
				required: true,
				default: '',
				description: 'Start date for search range (YYYY-MM-DD)',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['search'],
					},
				},
				required: true,
				default: '',
				description: 'End date for search range (YYYY-MM-DD)',
			},
			// Update operation fields
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'First Name',
						name: 'first_name',
						type: 'string',
						default: '',
						description: 'Customer first name',
					},
					{
						displayName: 'Last Name',
						name: 'last_name',
						type: 'string',
						default: '',
						description: 'Customer last name',
					},
					{
						displayName: 'Phone Number',
						name: 'phone_number',
						type: 'string',
						default: '',
						description: 'Phone number',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						default: '',
						description: 'Email address',
					},
					{
						displayName: 'Address',
						name: 'address',
						type: 'string',
						default: '',
						description: 'Delivery address',
					},
					{
						displayName: 'Date',
						name: 'date',
						type: 'dateTime',
						default: '',
						description: 'Delivery date (YYYY-MM-DD)',
					},
					{
						displayName: 'Comment',
						name: 'comment',
						type: 'string',
						typeOptions: {
							rows: 4,
						},
						default: '',
						description: 'Additional comments',
					},
					{
						displayName: 'Priority',
						name: 'priority',
						type: 'number',
						default: 0,
						description: 'Priority level',
					},
				],
			},
			// Action operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['action'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new action for a job',
						action: 'Create an action',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an action by ID',
						action: 'Get an action',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all actions for a job',
						action: 'Get all actions',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an action',
						action: 'Update an action',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an action',
						action: 'Delete an action',
					},
				],
				default: 'create',
			},
			// Action fields
			{
				displayName: 'Job ID',
				name: 'jobId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['action'],
					},
				},
				required: true,
				default: '',
				description: 'The ID of the job this action belongs to',
			},
			{
				displayName: 'Action ID',
				name: 'actionId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['action'],
						operation: ['get', 'update', 'delete'],
					},
				},
				required: true,
				default: '',
				description: 'The ID of the action',
			},
			// Create action fields
			{
				displayName: 'Action Type',
				name: 'actionType',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['action'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'Pickup',
						value: 'pickup',
					},
					{
						name: 'Delivery',
						value: 'delivery',
					},
					{
						name: 'Task',
						value: 'task',
					},
					{
						name: 'Appointment',
						value: 'appointment',
					},
				],
				default: 'delivery',
				required: true,
				description: 'The type of action',
			},
			// Update action fields
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['action'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: [
							{
								name: 'Pickup',
								value: 'pickup',
							},
							{
								name: 'Delivery',
								value: 'delivery',
							},
							{
								name: 'Task',
								value: 'task',
							},
							{
								name: 'Appointment',
								value: 'appointment',
							},
						],
						default: 'delivery',
						description: 'The type of action',
					},
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{
								name: 'Planned',
								value: 'planned',
							},
							{
								name: 'In Progress',
								value: 'in_progress',
							},
							{
								name: 'Completed',
								value: 'completed',
							},
							{
								name: 'Failed',
								value: 'failed',
							},
						],
						default: 'planned',
						description: 'The status of the action',
					},
					{
						displayName: 'Note',
						name: 'note',
						type: 'string',
						typeOptions: {
							rows: 4,
						},
						default: '',
						description: 'Additional notes for the action',
					},
				],
			},
			// Itinerary operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['itinerary'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new itinerary',
						action: 'Create an itinerary',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an itinerary by ID',
						action: 'Get an itinerary',
					},
					{
						name: 'Get by Date',
						value: 'getByDate',
						description: 'Get itineraries for a specific date',
						action: 'Get itineraries by date',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an itinerary',
						action: 'Update an itinerary',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an itinerary',
						action: 'Delete an itinerary',
					},
					{
						name: 'Add Job',
						value: 'addJob',
						description: 'Add a job to an itinerary',
						action: 'Add job to itinerary',
					},
					{
						name: 'Remove Job',
						value: 'removeJob',
						description: 'Remove a job from an itinerary',
						action: 'Remove job from itinerary',
					},
				],
				default: 'create',
			},
			// Itinerary fields
			{
				displayName: 'Itinerary ID',
				name: 'itineraryId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['itinerary'],
						operation: ['get', 'update', 'delete', 'addJob', 'removeJob'],
					},
				},
				required: true,
				default: '',
				description: 'The ID of the itinerary',
			},
			// Create itinerary fields
			{
				displayName: 'Name',
				name: 'itineraryName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['itinerary'],
						operation: ['create'],
					},
				},
				required: true,
				default: '',
				description: 'Name of the itinerary',
			},
			{
				displayName: 'Date',
				name: 'itineraryDate',
				type: 'dateTime',
				displayOptions: {
					show: {
						resource: ['itinerary'],
						operation: ['create', 'getByDate'],
					},
				},
				required: true,
				default: '',
				description: 'Date of the itinerary (YYYY-MM-DD)',
			},
			// Job management fields
			{
				displayName: 'Job ID',
				name: 'jobId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['itinerary'],
						operation: ['addJob', 'removeJob'],
					},
				},
				required: true,
				default: '',
				description: 'The ID of the job to add or remove',
			},
			// Update itinerary fields
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['itinerary'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Itinerary name',
					},
					{
						displayName: 'Date',
						name: 'date',
						type: 'dateTime',
						default: '',
						description: 'Itinerary date (YYYY-MM-DD)',
					},
					{
						displayName: 'Vehicle ID',
						name: 'vehicle_id',
						type: 'string',
						default: '',
						description: 'Vehicle ID for the itinerary',
					},
					{
						displayName: 'Operator IDs',
						name: 'operator_ids',
						type: 'string',
						default: '',
						description: 'Comma-separated list of operator IDs',
					},
				],
			},
			// Location operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['location'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a location by ID',
						action: 'Get a location',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all locations',
						action: 'Get all locations',
					},
				],
				default: 'getAll',
			},
			// Location fields
			{
				displayName: 'Location ID',
				name: 'locationId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['location'],
						operation: ['get'],
					},
				},
				required: true,
				default: '',
				description: 'The ID of the location',
			},
			// Vehicle operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['vehicle'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a vehicle by ID',
						action: 'Get a vehicle',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all vehicles',
						action: 'Get all vehicles',
					},
				],
				default: 'getAll',
			},
			// Vehicle fields
			{
				displayName: 'Vehicle ID',
				name: 'vehicleId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['vehicle'],
						operation: ['get'],
					},
				},
				required: true,
				default: '',
				description: 'The ID of the vehicle',
			},
			// Operator operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['operator'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get an operator by ID',
						action: 'Get an operator',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all operators',
						action: 'Get all operators',
					},
				],
				default: 'getAll',
			},
			// Operator fields
			{
				displayName: 'Operator ID',
				name: 'operatorId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['operator'],
						operation: ['get'],
					},
				},
				required: true,
				default: '',
				description: 'The ID of the operator',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const length = items.length > 0 ? items.length : 1;
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				let responseData;

				if (resource === 'job') {
					if (operation === 'create') {
						const date = this.getNodeParameter('date', i) as string;
						
						// Format date to YYYY-MM-DD
						const formatDate = (date: string) => {
							const d = new Date(date);
							return d.toISOString().split('T')[0];
						};
						
						const body: any = {
							skip_staging: this.getNodeParameter('skipStaging', i),
							first_name: this.getNodeParameter('firstName', i),
							phone_number: this.getNodeParameter('phoneNumber', i),
							address: this.getNodeParameter('address', i),
							date: formatDate(date),
						};
						
						// Add last name if provided
						const lastName = this.getNodeParameter('lastName', i) as string;
						if (lastName) {
							body.last_name = lastName;
						}
						responseData = await cigoTrackerApiRequest.call(this, 'POST', '/jobs', body);
					} else if (operation === 'get') {
						const jobId = this.getNodeParameter('jobId', i) as string;
						responseData = await cigoTrackerApiRequest.call(this, 'GET', `/jobs/id/${jobId}`);
					} else if (operation === 'search') {
						const startDate = this.getNodeParameter('startDate', i) as string;
						const endDate = this.getNodeParameter('endDate', i) as string;
						
						// Format dates to YYYY-MM-DD
						const formatDate = (date: string) => {
							const d = new Date(date);
							return d.toISOString().split('T')[0];
						};
						
						const body = {
							start_date: formatDate(startDate),
							end_date: formatDate(endDate),
						};
						responseData = await cigoTrackerApiRequest.call(this, 'POST', '/jobs/search', body);
					} else if (operation === 'update') {
						const jobId = this.getNodeParameter('jobId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as any;
						
						// Format date if provided
						if (updateFields.date) {
							const d = new Date(updateFields.date);
							updateFields.date = d.toISOString().split('T')[0];
						}
						
						responseData = await cigoTrackerApiRequest.call(this, 'PUT', `/jobs/id/${jobId}`, updateFields);
					} else if (operation === 'delete') {
						const jobId = this.getNodeParameter('jobId', i) as string;
						responseData = await cigoTrackerApiRequest.call(this, 'DELETE', `/jobs/id/${jobId}`);
					} else if (operation === 'cancel') {
						const jobId = this.getNodeParameter('jobId', i) as string;
						responseData = await cigoTrackerApiRequest.call(this, 'POST', `/jobs/id/${jobId}/cancel`);
					}
				} else if (resource === 'action') {
					const jobId = this.getNodeParameter('jobId', i) as string;
					
					if (operation === 'create') {
						const body = {
							type: this.getNodeParameter('actionType', i),
						};
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
					if (operation === 'create') {
						const date = this.getNodeParameter('itineraryDate', i) as string;
						
						// Format date to YYYY-MM-DD
						const formatDate = (date: string) => {
							const d = new Date(date);
							return d.toISOString().split('T')[0];
						};
						
						const body = {
							name: this.getNodeParameter('itineraryName', i),
							date: formatDate(date),
						};
						responseData = await cigoTrackerApiRequest.call(this, 'POST', '/itineraries', body);
					} else if (operation === 'get') {
						const itineraryId = this.getNodeParameter('itineraryId', i) as string;
						responseData = await cigoTrackerApiRequest.call(this, 'GET', `/itineraries/id/${itineraryId}`);
					} else if (operation === 'getByDate') {
						const date = this.getNodeParameter('itineraryDate', i) as string;
						const formatDate = (date: string) => {
							const d = new Date(date);
							return d.toISOString().split('T')[0];
						};
						responseData = await cigoTrackerApiRequest.call(this, 'GET', `/itineraries/date/${formatDate(date)}`);
					} else if (operation === 'update') {
						const itineraryId = this.getNodeParameter('itineraryId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as any;
						
						// Format date if provided
						if (updateFields.date) {
							const d = new Date(updateFields.date);
							updateFields.date = d.toISOString().split('T')[0];
						}
						
						// Convert operator_ids string to array
						if (updateFields.operator_ids) {
							updateFields.operator_ids = updateFields.operator_ids.split(',').map((id: string) => id.trim());
						}
						
						responseData = await cigoTrackerApiRequest.call(this, 'PUT', `/itineraries/id/${itineraryId}`, updateFields);
					} else if (operation === 'delete') {
						const itineraryId = this.getNodeParameter('itineraryId', i) as string;
						responseData = await cigoTrackerApiRequest.call(this, 'DELETE', `/itineraries/id/${itineraryId}`);
					} else if (operation === 'addJob') {
						const itineraryId = this.getNodeParameter('itineraryId', i) as string;
						const jobId = this.getNodeParameter('jobId', i) as string;
						responseData = await cigoTrackerApiRequest.call(this, 'POST', `/itineraries/id/${itineraryId}/job_id/${jobId}`);
					} else if (operation === 'removeJob') {
						const itineraryId = this.getNodeParameter('itineraryId', i) as string;
						const jobId = this.getNodeParameter('jobId', i) as string;
						responseData = await cigoTrackerApiRequest.call(this, 'DELETE', `/itineraries/id/${itineraryId}/job_id/${jobId}`);
					}
				} else if (resource === 'location') {
					if (operation === 'get') {
						const locationId = this.getNodeParameter('locationId', i) as string;
						responseData = await cigoTrackerApiRequest.call(this, 'GET', `/locations/id/${locationId}`);
					} else if (operation === 'getAll') {
						responseData = await cigoTrackerApiRequest.call(this, 'GET', '/locations');
					}
				} else if (resource === 'vehicle') {
					if (operation === 'get') {
						const vehicleId = this.getNodeParameter('vehicleId', i) as string;
						responseData = await cigoTrackerApiRequest.call(this, 'GET', `/vehicles/id/${vehicleId}`);
					} else if (operation === 'getAll') {
						responseData = await cigoTrackerApiRequest.call(this, 'GET', '/vehicles');
					}
				} else if (resource === 'operator') {
					if (operation === 'get') {
						const operatorId = this.getNodeParameter('operatorId', i) as string;
						responseData = await cigoTrackerApiRequest.call(this, 'GET', `/operators/id/${operatorId}`);
					} else if (operation === 'getAll') {
						responseData = await cigoTrackerApiRequest.call(this, 'GET', '/operators');
					}
				}

				if (Array.isArray(responseData)) {
					returnData.push(...responseData.map((item, index) => ({
						json: item,
						pairedItem: i,
					})));
				} else if (responseData) {
					returnData.push({
						json: responseData,
						pairedItem: i,
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error';
					returnData.push({
						json: {
							error: errorMessage,
						},
						pairedItem: i,
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}