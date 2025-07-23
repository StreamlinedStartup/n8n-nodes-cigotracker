import { INodeProperties } from 'n8n-workflow';

export const vehicleOperations: INodeProperties[] = [
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
];

export const vehicleFields: INodeProperties[] = [
	// Get operation
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
];