import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CigoTrackerApi implements ICredentialType {
	name = 'cigoTrackerApi';
	displayName = 'CigoTracker API';
	documentationUrl = 'https://app.cigotracker.com/api/documentation';
	properties: INodeProperties[] = [
		{
			displayName: 'Environment',
			name: 'environment',
			type: 'options',
			options: [
				{
					name: 'Production',
					value: 'production',
				},
				{
					name: 'Sandbox (Demo)',
					value: 'sandbox',
				},
			],
			default: 'production',
			description: 'The environment to connect to',
		},
		{
			displayName: 'API Account ID',
			name: 'apiAccountId',
			type: 'string',
			default: '',
			required: true,
			description: 'Your CigoTracker API Account ID. To obtain: Log in as admin → Integrations → API settings → Enable API access',
		},
		{
			displayName: 'API Auth Key',
			name: 'apiAuthKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your CigoTracker API Auth Key',
		},
	];
}