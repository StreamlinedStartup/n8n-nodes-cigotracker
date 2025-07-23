import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { cigoTrackerApiRequest } from './CigoTracker.helpers';

export class CigoTrackerMinimal implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'CigoTracker Minimal',
		name: 'cigoTrackerMinimal',
		icon: 'file:Cigo-Logo.png',
		group: ['transform'],
		version: 1,
		description: 'Minimal CigoTracker test node',
		defaults: {
			name: 'CigoTracker Minimal',
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
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				options: [
					{
						name: 'Test Message',
						value: 'test',
						description: 'Return a test message',
					},
					{
						name: 'Ping API',
						value: 'ping',
						description: 'Test API connection',
					},
				],
				default: 'test',
				description: 'Choose operation',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const operation = this.getNodeParameter('operation', 0) as string;
		
		try {
			if (operation === 'test') {
				return [[{ 
					json: { 
						message: 'Test successful',
						itemCount: items.length,
						timestamp: new Date().toISOString(),
					} 
				}]];
			} else if (operation === 'ping') {
				const response = await cigoTrackerApiRequest.call(this, 'GET', '/ping');
				return [[{ 
					json: response || { message: 'Ping successful' }
				}]];
			}
		} catch (error) {
			if (this.continueOnFail()) {
				return [[{ 
					json: { 
						error: error instanceof Error ? error.message : 'Unknown error',
						operation,
					} 
				}]];
			}
			throw error;
		}
		
		return [[{ json: { message: 'No operation performed' } }]];
	}
}