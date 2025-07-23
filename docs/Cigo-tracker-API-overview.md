The Cigo Tracker API enables you to:

- Create, retrieve, update and delete Jobs
- Create, retrieve, update and delete Actions related to Jobs
- Create, retrieve, update and delete Itineraries

This also allows you to dynamically preview potential Itinerary routes, assign operators, vehicles, and change stop positions

- Retrieve Locations, Vehicles and Operators created within the platform
# API Connections
## Production
For API connections in the production environment, specify the URL: https://app.cigotracker.com

## Sandbox (Demo)
For API connections in the sandbox environment, specify the URL: https://app-demo.cigotracker.com

Important: Jobs created with a valid email and/or a mobile_number may be notified via Email and SMS to follow their order even in the sandbox environment. In your testing, we recommend only sending notifications to internal recipients.

# Webhooks
After enabling the API, you can manage webhooks from the web portal to monitor the following system actions:

## Job-related events
All Job status changes
Independent Job status changes: In Progress, Completed, Incomplete, Partially Completed, Damaged, Resolved, Cancelled
Job creation, information updates, and assignation to itinerary
Job Action creation, information updates (excluding status changes) or deletion via the Operator mobile app
## Itinerary-related events
Itinerary creation (including when cloned from the Planner page)
Itinerary updates (triggered by changes to stops, assigned vehicle, start or end location, or assigned operators)
Itinerary deletion
# Notes
At this time, you cannot manage your webhooks via the API
You must login as the Administrator of the account to enable the API and manage webhooks
Webhooks Signature Verification
Relay attacks are a common issue in webhook verification, where an attacker intercepts a webhook message and resends it to the intended recipient. This section outlines measures to prevent relay attacks using headers X-Cigo-Tracker-Timestamp and X-Cigo-Tracker-Signature.

Headers Overview
When receiving a webhook message, your application should expect two headers:

X-Cigo-Tracker-Timestamp
The timestamp of when the message was sent.

X-Cigo-Tracker-Signature
A digital signature generated using the API secret key, API account ID, message body and timestamp

Using Custom Webhook Credentials
Cigo allows Provider Administrators (or Super Admins managing them) to configure a Custom Webhook ID and a Custom Webhook Secret.

Custom Webhook ID: If configured, this value will be used by Cigo.
Custom Webhook Secret: If configured, this value will be used by Cigo.
If these custom values are set, they will override the standard Public API Account ID and Secret Key. You can configure these custom values in your Provider Settings within the Cigo platform, under the Public API section in settings.

Important: Handling Changes to Custom Webhook ID or Secret
When you update your Custom Webhook ID or Custom Webhook Secret in the Cigo Provider Settings, please be aware of the following:

##New Signatures Only: Cigo will immediately start using the new Custom Webhook ID and/or Secret to generate the X-Cigo-Tracker-Signature for all subsequent webhook events.
Verification Process
To verify the authenticity and prevent relay attacks, follow these steps:

## Generate your own signature
Determine Credentials to Use:
API Account ID ($api_account_id_to_use):
If you have configured a Custom Webhook ID in your Cigo Provider Settings, use that value.
Otherwise, use your standard Public API Account ID.
Secret Key ($secret_key_to_use):
If you have configured a Custom Webhook Secret in your Cigo Provider Settings, use that value (the plain text secret).
Otherwise, use your standard Public API Secret Key.
Prepare the Signature String:
Let $payload be the raw (Unscaped) JSON string of the webhook request body.
Let $timestamp be the integer value from the X-Cigo-Tracker-Timestamp header.
Concatenate the API Account ID to use, the payload, and the timestamp, using a colon (:) as a delimiter.
$message = $api_account_id_to_use . ':' . $payload . ':' . $timestamp;
Compute the signature:

Using your Public API Secret Key, generate an HMAC SHA-256 hash of the $message:
   $signature = hash_hmac('sha256', $message, $secret_key_to_use, true);
Encode the signature:

Base64-encode the resulting HMAC SHA-256 hash:
  $encoded_signature = base64_encode($signature);
Example Code
// Generate your own signature
function generateSignature($api_account_id, $payload, $timestamp, $secret_key) {
   $formatted = $api_account_id . ':' . $payload . ':' . $timestamp;
   return base64_encode(hash_hmac('sha256', $formatted, $secret_key, true));
}

// Extract information
$timestamp = intval($_SERVER['HTTP_X_CIGO_TRACKER_TIMESTAMP']);

// Other information
$api_account_id = 'your-api-account-id'
$secret_key = 'your-api-secret-key';
$payload = json_decode('webhook-response-data');

$signature = generateSignature($api_account_id, $payload, $timestamp, $secret_key);

// Validate message
// Compare generated signature with provided X-Cigo-Tracker-Signature header value
if ($signature == $_SERVER['HTTP_X_CIGO_TRACKER_SIGNATURE']) {
   // Check if timestamp is within 5 minutes of the current timestamp
   $current_timestamp = time();
   if ((abs($timestamp - $current_timestamp) / 60) <= 300) { // 300 seconds -> 5 minutes
      echo('Message is valid and not a relay attack.');
   }
} else {
   echo('Invalid signature, consider re-sending the message.');
}
# Key Concepts & FAQ
There are some key Cigo concepts to understand in order to easily navigate documentation and use our API.

## What is a Job?
A Job is a general term used in Cigo to describe a destination, such as a Customer, where your Operator(s) may do a delivery, a service call, an installation, or various Job Actions (see explanation on 'Job Action' below).

When a job is created via the API, its initial status value is staging. If you log in to Cigo, you can find this Job by opening the sidebar menu and navigating the Import Tool page. Once you've landed on the Import Tool page, you'll find your created API records under the 'Review records from API Integration' tab.

Dispatcher will typically use the Import Tool to validate and review upcoming Jobs prior to dispatching them to vehicles. At a glance, they can validate if the address of each Job will be properly geo-coded and if the address string is valid.

However, if this step is not needed for your integration, you can skip the Import Tool when the Job is created via the API by setting skip_staging to true (for details, refer to the POST Create a new Job).

## Job statuses range from:

**staging**: Jobs created with skip_staging: false (default) will return this status. Jobs in this state cannot be routed and have to be reviewed in the Import Tool.
**new**: Jobs post-import (or if created via the API with skip_staging: true). This is the base state of a job that can be or has been added to an Itinerary's route.
**in progress**: Once an operator selects 'On Route' in the mobile app, the job will transition to this state. If this isn't the first Job in the itinerary, the Job prior must have been started and finished before this status can be set.
**completed**: Once an operator selects 'Completed' in the mobile app, the job will transition to this state. A job must have been in progress to be transitioned in this state.
**incomplete**: Once an operator selects 'Incomplete' in the mobile app, the job will transition to this state. From the Company Settings page, under the Operator App Options section, your organization can choose to disable this status option entirely, and it will not be available to the operator as a selection. Furthermore, your organization can choose to enforce a report with either images and/or text explanations required for said report. This is managed from the Company Settings page, under the Fulfillment Options section.
partially completed: This state is special in the sense that an operator does not directly select it. Instead, a job is transitioned to this state only when an operator has one or many actions marked as either 'Damaged' or 'Incomplete' and chooses the 'Completed' state on the overall job. This results in a job being partially completed.
**damaged**: Once an operator selects 'Damaged' in the mobile app, and fills out a report, the job will transition to this state. From the Company Settings page, under the Operator App Options section, your organization can choose to disable this status option entirely, and it will not be available to the operator as a selection.
**resolved**: This status is special. It cannot be set by the operators. Instead it is managed from the web after a job has been transitioned from either incomplete, damaged or partially completed, the status of the job can be transitioned to 'Resolved' by a web user. This can be useful to indicate that a prior mishap has been resolved and that this job no longer requires attention.
**cancelled**: This status marks that the job has been cancelled and won't be done in this route anymore.
## What is a Job Action?
A Job can be assigned any number of Actions. These Actions serve as a to-do list for the Operator arriving on site (i.e. a customer's location). Actions have types (i.e. delivery, installation, service, etc.) and other attributes, such as handle time (the amount of time the action is estimated to take).

Job Action statuses range from:

**undetermined**: No status has been set for this Job Action yet. This is the default state.
**completed**: This Job Action has been fulfilled without any issues.
**incomplete**: This Job Action could not be fulfilled.
**damaged**: An incident is related to this Job Action.

## How are Customer profiles created and updated?
When you create a new Job, an existing Customer profile is either linked or created. Customer profiles are created or updated based on a Job's first name, last name, phone number, and address fields.

When you first create a Job, you can assign a Customer Reference ID. When you create new Jobs assigned to the same Customer Reference ID, it'll keep all of them associated with the same Customer.

### Can I create or update a Customer profile without creating or updating a Job?
No, you cannot. Within the web interface, there are a few things you can update on an existing Customer profile, but this is not currently available via the API.

### Sometimes when I create a new Job, I get a 409 Conflict. What does it mean?
In order to prevent duplicate orders from being entered into Cigo Tracker, we prevent orders with the same core information from being re-entered. For example, if you have an order with the same first name, last name, address, and delivery date, we detect it as a duplicate job and prevent its creation.

This default behaviour may not be suitable for your business if you can receive multiples orders per day by the same customer. In that case, setting a unique reference_id during the Job creation process will allow you to workaround this restriction. If you have a unique Order ID from an external system (e.g. Shopify), you can use that in your reference_id field and Cigo Tracker will ignore the duplicate check.

### Jobs were created via the API, but I can't find them anywhere.
If you did not specify skip_staging: true in your POST call to create a Job, it'll be created in the staging status.

You'll only be able to find this Job by logging into the Cigo Tracker web portal, opening the sidebar menu and navigating the Import Tool page. Once you've landed on the Import Tool page, you'll find your created Job records under the 'Review records from API Integration' tab.

## What are Pickups and Drop-offs? How are they created?
Pickups and Drop-offs are automatically generated by Cigo. Every Pickup and Drop-off is directly corelated to a Job Action via its stop_location_id. For instance, if a Job has an Action of type 'pickup' with a valid stop_location_id, once an Itinerary is created by your Dispatcher, a Pickup will automatically be created to indicate that it must be done prior to the related Job.

## What is an Itinerary?
An Itinerary is a detailed list of ordered Route Stops; including it's initial start and final return location, estimated time of departure, as well as the assigned Operator(s) and Vehicle.

## What is a Stop?
A Stop, or Route Stop, is simply a geographical location on an Itinerary and it can either a Job, a Pickup, or a Drop-off.

## What is an Operator?
An Operator is an individual assigned to an Itinerary. For instance, if your company handles the delivery of goods, you may already internally refer to your Operators as Drivers, as opposed to Technicians in other industries. Operators interact with Cigo via our mobile application.

## What is a Dispatcher?
A Dispatcher is a web platform user that is able to create Itineraries, create Jobs, Actions, and has direct access to the Staging Area (inside of Cigo, the Staging Area is referred to as the 'Import Tool').

## What is a Sub-user?
A sub-user represents an authorized merchant who has restricted access to the API. Access to the API is limited to merchants at Level 2. When making requests, sub-users are subject to validation and filtering based on their assigned Locations.

## General Notes
Unless specified otherwise, time and datetime values returned by the API are in GMT (UTC+00:00).


