export interface CigoTrackerCredentials {
	environment: 'production' | 'sandbox';
	apiAccountId: string;
	apiAuthKey: string;
}

export interface JobTimeFrame {
	start: string;
	end: string;
}

export interface JobCoordinates {
	latitude: number;
	longitude: number;
}

export interface JobAction {
	id?: string;
	type: 'delivery' | 'pickup' | 'return' | 'exchange' | 'installation' | 'service' | 'custom';
	status?: 'undetermined' | 'completed' | 'incomplete' | 'damaged';
	name?: string;
	description?: string;
	handle_time?: number;
	quantity?: number;
	stop_location_id?: string;
	reference_id?: string;
	custom_fields?: Record<string, any>;
}

export interface Job {
	id?: string;
	status?: 'staging' | 'new' | 'in progress' | 'completed' | 'incomplete' | 'partially completed' | 'damaged' | 'resolved' | 'cancelled';
	skip_staging?: boolean;
	first_name?: string;
	last_name?: string;
	email?: string;
	phone_number?: string;
	mobile_number?: string;
	address?: string;
	apartment?: string;
	postal_code?: string;
	city?: string;
	province?: string;
	country?: string;
	date?: string;
	time_frame?: JobTimeFrame;
	reference_id?: string;
	customer_reference_id?: string;
	branch_id?: string;
	distribution_center_id?: string;
	coordinates?: [number, number];
	comment?: string;
	balance_owed?: number;
	actions?: JobAction[];
}

export interface Itinerary {
	id?: string;
	name?: string;
	date?: string;
	vehicle_id?: string;
	operator_ids?: string[];
	start_location_id?: string;
	end_location_id?: string;
	stops?: any[];
}