import { INodeProperties } from 'n8n-workflow';

export const actionOperations: INodeProperties[] = [
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
				description: 'Create a new job action',
				action: 'Create an action',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a specific action',
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
];

export const actionFields: INodeProperties[] = [
	// Job ID (required for all operations)
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
	// Action ID (for get, update, delete)
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
	// Create operation
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'Delivery',
				value: 'delivery',
			},
			{
				name: 'Pickup',
				value: 'pickup',
			},
			{
				name: 'Return',
				value: 'return',
			},
			{
				name: 'Exchange',
				value: 'exchange',
			},
			{
				name: 'Installation',
				value: 'installation',
			},
			{
				name: 'Service',
				value: 'service',
			},
			{
				name: 'Custom',
				value: 'custom',
			},
		],
		required: true,
		default: 'delivery',
		description: 'The type of action',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Action name',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Action description',
			},
			{
				displayName: 'Handle Time',
				name: 'handle_time',
				type: 'number',
				default: 0,
				description: 'Estimated time to complete action (in minutes)',
			},
			{
				displayName: 'Quantity',
				name: 'quantity',
				type: 'number',
				default: 1,
				description: 'Quantity for this action',
			},
			{
				displayName: 'Reference ID',
				name: 'reference_id',
				type: 'string',
				default: '',
				description: 'External reference ID for this action',
			},
			{
				displayName: 'Stop Location ID',
				name: 'stop_location_id',
				type: 'string',
				default: '',
				description: 'ID of the stop location for pickup actions',
			},
			{
				displayName: 'Custom Fields',
				name: 'custom_fields',
				type: 'json',
				default: '{}',
				description: 'Custom fields as JSON object',
			},
		],
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
						name: 'Delivery',
						value: 'delivery',
					},
					{
						name: 'Pickup',
						value: 'pickup',
					},
					{
						name: 'Return',
						value: 'return',
					},
					{
						name: 'Exchange',
						value: 'exchange',
					},
					{
						name: 'Installation',
						value: 'installation',
					},
					{
						name: 'Service',
						value: 'service',
					},
					{
						name: 'Custom',
						value: 'custom',
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
						name: 'Undetermined',
						value: 'undetermined',
					},
					{
						name: 'Completed',
						value: 'completed',
					},
					{
						name: 'Incomplete',
						value: 'incomplete',
					},
					{
						name: 'Damaged',
						value: 'damaged',
					},
				],
				default: 'undetermined',
				description: 'Action status',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Action name',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Action description',
			},
			{
				displayName: 'Handle Time',
				name: 'handle_time',
				type: 'number',
				default: 0,
				description: 'Estimated time to complete action (in minutes)',
			},
			{
				displayName: 'Quantity',
				name: 'quantity',
				type: 'number',
				default: 1,
				description: 'Quantity for this action',
			},
			{
				displayName: 'Reference ID',
				name: 'reference_id',
				type: 'string',
				default: '',
				description: 'External reference ID for this action',
			},
			{
				displayName: 'Stop Location ID',
				name: 'stop_location_id',
				type: 'string',
				default: '',
				description: 'ID of the stop location for pickup actions',
			},
			{
				displayName: 'Custom Fields',
				name: 'custom_fields',
				type: 'json',
				default: '{}',
				description: 'Custom fields as JSON object',
			},
		],
	},
];