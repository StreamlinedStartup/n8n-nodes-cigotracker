import { INodeProperties } from 'n8n-workflow';

export const locationOperations: INodeProperties[] = [
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
];

export const locationFields: INodeProperties[] = [
	// Get operation
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
];