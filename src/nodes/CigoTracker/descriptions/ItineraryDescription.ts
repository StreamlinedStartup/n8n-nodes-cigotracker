import { INodeProperties } from 'n8n-workflow';

export const itineraryOperations: INodeProperties[] = [
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
				description: 'Get itineraries by date',
				action: 'Get itineraries by date',
			},
			{
				name: 'Get by Operator',
				value: 'getByOperator',
				description: 'Get itineraries by operator',
				action: 'Get itineraries by operator',
			},
			{
				name: 'Get by Vehicle',
				value: 'getByVehicle',
				description: 'Get itineraries by vehicle',
				action: 'Get itineraries by vehicle',
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
				name: 'Preview Route',
				value: 'previewRoute',
				description: 'Preview a potential route',
				action: 'Preview route',
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
			{
				name: 'Update Job Position',
				value: 'updateJobPosition',
				description: 'Update job position in itinerary',
				action: 'Update job position',
			},
		],
		default: 'create',
	},
];

export const itineraryFields: INodeProperties[] = [
	// Create operation
	{
		displayName: 'Name',
		name: 'name',
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
		name: 'date',
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
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['itinerary'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Vehicle ID',
				name: 'vehicle_id',
				type: 'string',
				default: '',
				description: 'ID of the vehicle assigned to this itinerary',
			},
			{
				displayName: 'Operator IDs',
				name: 'operator_ids',
				type: 'string',
				default: '',
				description: 'Comma-separated list of operator IDs',
			},
			{
				displayName: 'Start Location ID',
				name: 'start_location_id',
				type: 'string',
				default: '',
				description: 'ID of the starting location',
			},
			{
				displayName: 'End Location ID',
				name: 'end_location_id',
				type: 'string',
				default: '',
				description: 'ID of the ending location',
			},
			{
				displayName: 'Jobs',
				name: 'jobs',
				type: 'json',
				default: '[]',
				description: 'Array of job IDs to include in the itinerary',
			},
		],
	},
	// Get operations
	{
		displayName: 'Itinerary ID',
		name: 'itineraryId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['itinerary'],
				operation: ['get', 'update', 'delete', 'addJob', 'removeJob', 'updateJobPosition'],
			},
		},
		required: true,
		default: '',
		description: 'The ID of the itinerary',
	},
	{
		displayName: 'Operator ID',
		name: 'operatorId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['itinerary'],
				operation: ['getByOperator'],
			},
		},
		required: true,
		default: '',
		description: 'The ID of the operator',
	},
	{
		displayName: 'Vehicle ID',
		name: 'vehicleId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['itinerary'],
				operation: ['getByVehicle'],
			},
		},
		required: true,
		default: '',
		description: 'The ID of the vehicle',
	},
	// Update operation
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
				description: 'Name of the itinerary',
			},
			{
				displayName: 'Date',
				name: 'date',
				type: 'dateTime',
				default: '',
				description: 'Date of the itinerary (YYYY-MM-DD)',
			},
			{
				displayName: 'Vehicle ID',
				name: 'vehicle_id',
				type: 'string',
				default: '',
				description: 'ID of the vehicle assigned to this itinerary',
			},
			{
				displayName: 'Operator IDs',
				name: 'operator_ids',
				type: 'string',
				default: '',
				description: 'Comma-separated list of operator IDs',
			},
			{
				displayName: 'Start Location ID',
				name: 'start_location_id',
				type: 'string',
				default: '',
				description: 'ID of the starting location',
			},
			{
				displayName: 'End Location ID',
				name: 'end_location_id',
				type: 'string',
				default: '',
				description: 'ID of the ending location',
			},
		],
	},
	// Preview Route operation
	{
		displayName: 'Route Preview Fields',
		name: 'previewFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['itinerary'],
				operation: ['previewRoute'],
			},
		},
		options: [
			{
				displayName: 'Jobs',
				name: 'jobs',
				type: 'json',
				default: '[]',
				description: 'Array of job IDs to preview in the route',
				required: true,
			},
			{
				displayName: 'Start Location',
				name: 'start_location',
				type: 'json',
				default: '{}',
				description: 'Starting location object with latitude and longitude',
			},
			{
				displayName: 'End Location',
				name: 'end_location',
				type: 'json',
				default: '{}',
				description: 'Ending location object with latitude and longitude',
			},
			{
				displayName: 'Vehicle ID',
				name: 'vehicle_id',
				type: 'string',
				default: '',
				description: 'ID of the vehicle for route calculation',
			},
		],
	},
	// Add/Remove Job operations
	{
		displayName: 'Job ID',
		name: 'jobId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['itinerary'],
				operation: ['addJob', 'removeJob', 'updateJobPosition'],
			},
		},
		required: true,
		default: '',
		description: 'The ID of the job',
	},
	// Update Job Position
	{
		displayName: 'Position',
		name: 'position',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['itinerary'],
				operation: ['updateJobPosition'],
			},
		},
		required: true,
		default: 0,
		description: 'New position for the job in the itinerary (0-based index)',
	},
];