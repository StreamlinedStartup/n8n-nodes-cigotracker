import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class CigoTracker implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'CigoTracker',
		name: 'cigoTracker',
		icon: 'file:Cigo-Logo.png',
		group: ['transform'],
		version: 1,
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
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: 'Hello World',
				description: 'Test property',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		
		// Simple test - just return what we got
		const returnData: INodeExecutionData[] = items.map((item, index) => {
			return {
				json: {
					test: this.getNodeParameter('test', index),
					input: item.json,
				},
				pairedItem: index,
			};
		});

		// If no input items, return a single test item
		if (items.length === 0) {
			returnData.push({
				json: {
					test: this.getNodeParameter('test', 0),
					message: 'No input data',
				},
			});
		}

		return [returnData];
	}
}