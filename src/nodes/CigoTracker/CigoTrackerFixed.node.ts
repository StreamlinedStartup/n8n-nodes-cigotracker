import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	INodeProperties,
	NodeApiError,
} from 'n8n-workflow';

import { cigoTrackerApiRequest } from './CigoTracker.helpers';

export class CigoTracker implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'CigoTracker',
		name: 'cigoTracker',
		icon: 'file:Cigo-Logo.png',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
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
						name: 'Ping',
						value: 'ping',
						description: 'Test API connection',
						action: 'Test connection',
					},
					{
						name: 'Get All Jobs',
						value: 'getAll',
						description: 'Get all jobs',
						action: 'Get all jobs',
					},
				],
				default: 'ping',
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
				const operation = this.getNodeParameter('operation', 0) as string;
				let responseData;

				if (resource === 'job') {
					if (operation === 'ping') {
						responseData = await cigoTrackerApiRequest.call(this, 'GET', '/ping');
					} else if (operation === 'getAll') {
						responseData = await cigoTrackerApiRequest.call(this, 'GET', '/jobs');
					}
				}

				if (Array.isArray(responseData)) {
					for (const item of responseData) {
						returnData.push({
							json: item,
							pairedItem: i,
						});
					}
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