import { INodeProperties } from 'n8n-workflow';

export const operatorOperations: INodeProperties[] = [
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
];

export const operatorFields: INodeProperties[] = [
	// Get operation
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
];