import { INodeProperties } from 'n8n-workflow';

export const jobOperations: INodeProperties[] = [
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
				name: 'Ping',
				value: 'ping',
				description: 'Test API connection',
				action: 'Test connection',
			},
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
				name: 'Search',
				value: 'search',
				description: 'Search for jobs',
				action: 'Search jobs',
			},
			{
				name: 'Cancel',
				value: 'cancel',
				description: 'Cancel a job',
				action: 'Cancel a job',
			},
		],
		default: 'ping',
	},
];

export const jobFields: INodeProperties[] = [
	// Create operation
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
		default: false,
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
		required: true,
		default: '',
		description: 'Customer last name',
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
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Apartment',
				name: 'apartment',
				type: 'string',
				default: '',
				description: 'Apartment or unit number',
			},
			{
				displayName: 'Balance Owed',
				name: 'balance_owed',
				type: 'number',
				default: 0,
				description: 'Amount owed by the customer',
			},
			{
				displayName: 'Branch ID',
				name: 'branch_id',
				type: 'string',
				default: '',
				description: 'Branch ID (required for sub-users)',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'City name',
			},
			{
				displayName: 'Comment',
				name: 'comment',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Additional notes or comments',
			},
			{
				displayName: 'Coordinates',
				name: 'coordinates',
				type: 'string',
				default: '',
				description: 'Coordinates as "latitude,longitude" or "[latitude,longitude]"',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				description: 'Country name',
			},
			{
				displayName: 'Customer Reference ID',
				name: 'customer_reference_id',
				type: 'string',
				default: '',
				description: 'External customer reference ID',
			},
			{
				displayName: 'Distribution Center ID',
				name: 'distribution_center_id',
				type: 'string',
				default: '',
				description: 'Distribution center ID (required for sub-users)',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				description: 'Customer email address',
			},
			{
				displayName: 'Mobile Number',
				name: 'mobile_number',
				type: 'string',
				default: '',
				description: 'Customer mobile phone number',
			},
			{
				displayName: 'Phone Number',
				name: 'phone_number',
				type: 'string',
				default: '',
				description: 'Customer phone number',
			},
			{
				displayName: 'Postal Code',
				name: 'postal_code',
				type: 'string',
				default: '',
				description: 'Postal or ZIP code',
			},
			{
				displayName: 'Province',
				name: 'province',
				type: 'string',
				default: '',
				description: 'Province or state',
			},
			{
				displayName: 'Reference ID',
				name: 'reference_id',
				type: 'string',
				default: '',
				description: 'External reference ID (prevents duplicates)',
			},
			{
				displayName: 'Time Frame',
				name: 'time_frame',
				type: 'fixedCollection',
				default: {},
				options: [
					{
						name: 'timeFrame',
						displayName: 'Time Frame',
						values: [
							{
								displayName: 'Start Time',
								name: 'start',
								type: 'string',
								default: '',
								description: 'Start time in HH:MM format',
							},
							{
								displayName: 'End Time',
								name: 'end',
								type: 'string',
								default: '',
								description: 'End time in HH:MM format',
							},
						],
					},
				],
			},
		],
	},
	// Get operation
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
	// Update operation
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
				displayName: 'Address',
				name: 'address',
				type: 'string',
				default: '',
				description: 'Delivery address',
			},
			{
				displayName: 'Apartment',
				name: 'apartment',
				type: 'string',
				default: '',
				description: 'Apartment or unit number',
			},
			{
				displayName: 'Balance Owed',
				name: 'balance_owed',
				type: 'number',
				default: 0,
				description: 'Amount owed by the customer',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'City name',
			},
			{
				displayName: 'Comment',
				name: 'comment',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Additional notes or comments',
			},
			{
				displayName: 'Coordinates',
				name: 'coordinates',
				type: 'string',
				default: '',
				description: 'Coordinates as "latitude,longitude" or "[latitude,longitude]"',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				description: 'Country name',
			},
			{
				displayName: 'Date',
				name: 'date',
				type: 'dateTime',
				default: '',
				description: 'Delivery date in YYYY-MM-DD format',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				description: 'Customer email address',
			},
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
				displayName: 'Mobile Number',
				name: 'mobile_number',
				type: 'string',
				default: '',
				description: 'Customer mobile phone number',
			},
			{
				displayName: 'Phone Number',
				name: 'phone_number',
				type: 'string',
				default: '',
				description: 'Customer phone number',
			},
			{
				displayName: 'Postal Code',
				name: 'postal_code',
				type: 'string',
				default: '',
				description: 'Postal or ZIP code',
			},
			{
				displayName: 'Province',
				name: 'province',
				type: 'string',
				default: '',
				description: 'Province or state',
			},
			{
				displayName: 'Reference ID',
				name: 'reference_id',
				type: 'string',
				default: '',
				description: 'External reference ID',
			},
			{
				displayName: 'Time Frame',
				name: 'time_frame',
				type: 'fixedCollection',
				default: {},
				options: [
					{
						name: 'timeFrame',
						displayName: 'Time Frame',
						values: [
							{
								displayName: 'Start Time',
								name: 'start',
								type: 'string',
								default: '',
								description: 'Start time in HH:MM format',
							},
							{
								displayName: 'End Time',
								name: 'end',
								type: 'string',
								default: '',
								description: 'End time in HH:MM format',
							},
						],
					},
				],
			},
		],
	},
	// Search operation
	{
		displayName: 'Search Fields',
		name: 'searchFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['search'],
			},
		},
		options: [
			{
				displayName: 'Start Date',
				name: 'start_date',
				type: 'dateTime',
				default: '',
				description: 'Start date for search range (YYYY-MM-DD)',
				required: true,
			},
			{
				displayName: 'End Date',
				name: 'end_date',
				type: 'dateTime',
				default: '',
				description: 'End date for search range (YYYY-MM-DD). Maximum 30 days from start date.',
				required: true,
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'Staging',
						value: 'staging',
					},
					{
						name: 'New',
						value: 'new',
					},
					{
						name: 'In Progress',
						value: 'in progress',
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
						name: 'Partially Completed',
						value: 'partially completed',
					},
					{
						name: 'Damaged',
						value: 'damaged',
					},
					{
						name: 'Resolved',
						value: 'resolved',
					},
					{
						name: 'Cancelled',
						value: 'cancelled',
					},
				],
				default: '',
				description: 'Filter by job status',
			},
		],
	},
];