import i18n from 'i18next';

const t = (key: any, def: string) => i18n.t(key, { defaultValue: def });

export const TEXT = {
  please_enter_your_mobile_telsil_name: () =>
    t(
      'please_enter_your_mobile_telsil_name',
      'Please enter your Mobile Number and Tehsil',
    ),
  enter_phone_number: () => t('enter_phone_number', 'Enter your phone number'),
  your_phone_number: () => t('your_phone_number', 'Your Phone Number'),
  phone_number_is_required: () =>
    t('phone_number_is_required', 'Phone number is required'),
  select_taluka: () => t('select_taluka', 'Select Tehsil'),
  select_tehsil: () => t('select_tehsil', 'Select Tehsil'),
  tehsil_is_required: () => t('tehsil_is_required', 'Tehsil is required'),
  login: () => t('login', 'Login'),
  please_enter_pin_code: () =>
    t('please_enter_pin_code', 'Please use your PIN code to log in'),
  enter_valid_10_digit_number: () =>
    t('enter_valid_10_digit_number', 'Enter a valid 10-digit number'),
  otp_verification: () => t('otp_verification', 'OTP Verification'),
  please_enter_otp_sent_to: () =>
    t('please_enter_otp_sent_to', 'Please enter the OTP sent to'),
  forgot_pin: () => t('forgot_pin', 'Forgot PIN...'),
  resend_otp: () => t('resend_otp', 'Resend OTP'),
  next: () => t('next', 'Next'),
  otp_expire_in: () => t('otp_expire_in', 'OTP will expired in '),
  submit: () => t('submit', 'Submit'),
  default_view_incidents: () =>
    t(
      'default_view_incidents',
      'Default view: Incidents within 2 km around you.',
    ),
  securely_reset_your_pin: () =>
    t('securely_reset_your_pin', 'Securely reset your PIN in minutes'),
  please_complete_profile: () =>
    t('please_complete_profile', 'Please complete your profile'),
  full_name: () => t('full_name', 'Full Name'),
  enter_full_name: () => t('enter_full_name', 'Enter full name'),
  emergency_contact_details: () =>
    t('emergency_contact_details', 'Emergency Contact Details'),
  mobile_number: () => t('mobile_number', 'Mobile Number'),
  save: () => t('save', 'Save'),
  reminder_to_complete_profile: () =>
    t('reminder_to_complete_profile', 'Reminder to complete your profile.'),
  update_profile: () => t('update_profile', 'Update Profile'),
  profile: () => t('profile', 'Profile'),
  emergency_contact_info: () =>
    t('emergency_contact_info', 'Emergency Contact Information'),
  email_id: () => t('email_id', 'Email Id'),
  enter_email_id: () => t('enter_email_id', 'Enter email id'),
  district: () => t('district', 'District'),
  city: () => t('city', 'City'),
  tehsil: () => t('tehsil', 'Tehsil'),
  upload_document: () => t('upload_document', 'Upload Document'),
  primary_contact_name: () => t('primary_contact_name', 'Primary Contact Name'),
  relation: () => t('relation', 'Relation'),
  Select_relation: () => t('select_relation', 'Select relation'),
  primary_mobile_number: () =>
    t('primary_mobile_number', 'Primary Mobile Number'),
  enter_primary_mobile_number: () =>
    t('enter_primary_mobile_number', 'Enter primary mobile number'),
  alternate_mobile_number: () =>
    t('alternate_mobile_number', 'Alternate Mobile Number'),
  home: () => t('home', 'Home'),
  community: () => t('community', 'Community'),
  nearby_live_incident: () => t('nearby_live_incident', 'Nearby Live Incident'),
  basic_information: () => t('basic_information', 'Basic Information'),
  full_name_is_required: () =>
    t('full_name_is_required', 'Full name is required'),
  incident_records: () => t('incident_records', 'Incident Records'),
  my_incident_records: () => t('my_incident_records', ' My Incident Records'),
  assigned_incident_records: () =>
    t('assigned_incident_records', 'Assigned Incident Record'),
  help: () => t('help', 'Help'),
  weather: () => t('weather', 'Weather'),
  maps: () => t('maps', 'Maps'),

  responders: () => t('responders', 'Responders'),
  edit_profile: () => t('edit_profile', 'Edit Profile'),
  profile_incomplete: () => t('profile_incomplete', 'Profile Incomplete'),
  change_pin: () => t('change_pin', 'Change PIN'),
  log_out: () => t('log_out', 'Log Out'),
  pin_code_required: () => t('pin_code_required', 'Pin code required'),
  save_as_draft: () => t('save_as_draft', 'Save as draft'),
  blood_group: () => t('blood_group', 'Blood Group'),
  secondary_contact_name: () =>
    t('secondary_contact_name', 'Secondary Contact Name'),
  pin_reset: () => t('pin_reset', 'PIN Reset'),
  new_pin: () => t('new_pin', 'New PIN'),
  confirm_pin: () => t('confirm_pin', 'Confirm PIN'),
  pincode: () => t('pincode', 'PIN Code'),
  secondary_mobile_number: () =>
    t('secondary_mobile_number', 'Secondary Mobile Number'),

  enter_mobile_number: () => t('enter_mobile_number', 'Enter Mobile Number'),
  enter_alternate_mobile_number: () =>
    t('enter_alternate_mobile_number', 'Enter Alternate Mobile Number'),
  on_duty_responders: () => t('on_duty_responders', 'On-Duty Responders'),

  incident_type: () => t('incident_type', 'Incident Type'),
  enter_description: () => t('enter_description', 'Please Enter Description'),

  description_required: () => t('description_required', 'Description Required'),
  select_incident_type: () => t('select_incident_type', 'Select Incident Type'),
  look_good: () => t('look_good', 'Look Good'),
  confirm_address: () => t('confirm_address', 'Confirm your Address'),

  country_region: () => t('country_region', 'Country/region'),
  country: () => t('country', 'Country'),

  detailed_address: () => t('detailed_address', 'Detailed address'),

  flat_house: () => t('flat_house', 'Flat, house, etc.'),

  street_address: () => t('street_address', 'Street address'),
  nearby_landmark: () => t('nearby_landmark', 'Nearby landmark'),

  division: () => t('division', 'Division'),

  state: () => t('state', 'State'),

  show_location: () => t('show_location', 'Show your specific location'),
  confirm: () => t('confirm', 'Confirm'),

  upload_valid_id: () => t('upload_valid_id', 'Upload valid ID proof'),

  enter_address: () => t('enter_address', 'Enter Address'),

  address: () => t('address', 'Address'),
  block: () => t('block', 'Block'),

  block_required: () => t('block_required', 'Block required'),

  date_of_birth: () => t('date_of_birth', 'Date of Birth'),

  enter_secondary_mobile: () =>
    t('enter_secondary_mobile', 'Enter Secondary Mobile Number'),

  enter_pin_code: () => t('enter_pin_code', 'Enter Pin code'),

  minutes: () => t('minutes', 'Minutes'),

  no_incident_records: () =>
    t('no_incident_records', 'No incident records found'),

  create: () => t('create', 'Create'),

  description: () => t('description', 'Description'),
  incident_details: () => t('incident_details', 'Incident Details'),

  ///////////////////

  incident_id: () => t('incident_id', 'Incident Id'),

  please_upload_photo: () =>
    t('please_upload_photo', 'Please Upload The Photo'),

  enter_your_address: () => t('enter_your_address', 'Enter your address'),
  other_incident_records: () => t('other_incident_records', 'Address'),

  assign_responders: () =>
    t('assign_responders', 'Assign responders to the incident report'),

  reach_nearby_services: () =>
    t(
      'reach_nearby_services',
      'Please reach out to nearby services for help till we notify our Responders.',
    ),

  duplicate: () => t('duplicate', 'Duplicate'),

  reason_cancellation: () =>
    t('reason_cancellation', 'Reason for cancellation'),

  provide_reason_cancellation: () =>
    t('provide_reason_cancellation', 'Provide reason for cancellation'),

  select_reason_rejection: () =>
    t('select_reason_rejection', 'Select reason for rejection'),

  country_required: () => t('country_required', 'Country is required'),

  address_required: () => t('address_required', 'Address is required'),

  city_required: () => t('city_required', 'City is required'),

  district_required: () => t('district_required', 'District is required'),

  profile_draft: () =>
    t('profile_draft', 'Profile saved as draft successfully'),

  profile_saved: () => t('profile_saved', 'Profile saved successfully'),

  current_pin: () => t('current_pin', 'Current PIN'),

  pin_reset_success: () =>
    t('pin_reset_success', 'Your PIN has been reset successfully'),

  ambulance_service: () => t('ambulance_service', 'Ambulence service'),

  disaster_helpline_numbers: () =>
    t('disaster_helpline_numbers', 'Disaster Helpline Numbers'),

  pin_verified: () => t('pin_verified', 'PIN Verified'),

  women_helpline: () => t('women_helpline', 'Women Helpline'),

  std_code: () => t('std_code', 'STD Code'),
  important_numbers: () => t('important_numbers', 'Important Numbers'),
  police: () => t('police', 'Police'),
  fire_service: () => t('fire_service', 'Fire Service'),
  child_helpline: () => t('child_helpline', 'Child Helpline'),
  sdrf_center: () => t('sdrf_center', 'SDRF Center'),
  police_stations: () => t('police_stations', 'Police Station'),
  hospital: () => t('hospital', 'Hospital'),
  boat: () => t('boat', 'Boat'),

  // monday

  upload_image: () => t('upload_image', 'Upload Image'),

  capture_or_upload: () =>
    t('capture_or_upload', 'Capture or upload incident images and videos'),
  document_required: () => t('document_required', 'Document is required'),
  create_incident: () => t('create_incident', 'Create Incident'),
  please_specify: () => t('please_specify', 'Please specify the incident type'),
  take_photo: () => t('take_photo', 'Take a photo'),
  select_from_device: () => t('select_from_device', 'Select from device'),
  status: () => t('status', 'Status'),
  date_time_reporting: () =>
    t('date_time_reporting', 'Date & Time of Reporting'),
  update: () => t('update', 'Update'),

  send: () => t('send', 'Send'),

  send_otp: () => t('send_otp', 'Send OTP'),

  tap_to_cancel: () =>
    t('tap_to_cancel', 'Tap 3 times to cancel the incident report'),

  confirm_submission: () =>
    t(
      'confirm_submission',
      'Your disaster report will be sent to the authorities for review and response, and immediate action will be taken. Do you want to proceed?',
    ),

  yes: () => t('yes', 'Yes'),

  no: () => t('no', 'No'),

  self_help_options: () => t('self_help_options', 'Self-Help Options'),

  police_station: () => t('police_station', 'Police Stations'),

  ambulance: () => t('ambulance', 'Ambulance'),

  reviewer: () => t('reviewer', 'Reviewer'),

  type: () => t('type', 'Type'),

  contact_details: () => t('contact_details', 'Contact Details'),

  sr_no: () => t('sr_no', 'Sr. No'),

  important_alert: () => t('important_alert', 'IMPORTANT ALERT'),

  acknowledge: () => t('acknowledge', 'Acknowledge'),

  incident_type_name: () => t('incident_type_name', 'Incident Type Name'),

  select_incident_id: () => t('select_incident_id', 'Select Incident Id'),

  incident_id_required: () => t('incident_id_required', 'Incident Id required'),

  only_alphabets: () => t('only_alphabets', 'Only alphabets are allowed'),

  relation_required: () => t('relation_required', 'Relation is required'),

  other_incident_type: () =>
    t('other_incident_type', 'Enter other incident type'),

  reject: () => t('reject', 'Reject'),

  accept: () => t('accept', 'Accept'),

  completed: () => t('completed', 'Completed'),

  image_and_video: () => t('image_and_video', 'Image and Video'),

  helpline_message: () =>
    t(
      'helpline_message',
      'While we alert your emergency contacts & notify nearby app users, please call below helpline numbers immediately.',
    ),

  emergency: () => t('emergency', 'Emergency'),

  clinic_hospital: () => t('clinic_hospital', 'Clinic/Hospital'),

  fire_brigade: () => t('fire_brigade', 'Fire Brigades'),

  all_fields_required: () =>
    t('all_fields_required', 'All fields are required'),

  new_confirm_not_match: () =>
    t('new_confirm_not_match', 'New PIN and Confirm PIN do not match'),

  unable_change_pin: () => t('unable_change_pin', 'Unable to change PIN'),

  somethingwent_whrong: () => t('somethingwent_whrong', 'Something went wrong'),

  your_decision: () =>
    t(
      'your_decision',
      'Your decision is needed on pending incident requests. Take action now',
    ),

  view_details: () => t('view_details', 'View Details'),

  filter: () => t('filter', 'Filter'),

  specify_another_type: () => t('specify_another_type', 'Specify Other Type'),

  select_duplicate_incident_id: () =>
    t('select_duplicate_incident_id', 'Select duplicate Incident Id'),

  pending_response_by_responder: () =>
    t('pending_response_by_responder', 'Pending closure by Responder'),

  while_creating_incident: () =>
    t(
      'while_creating_incident',
      'Something went wrong while creating the incident.',
    ),

  failed_creating_incident: () =>
    t('failed_creating_incident', 'Failed to create incident.'),

  failed_load_sound: () => t('failed_load_sound', 'Failed to load sound'),

  my_records: () => t('my_records', 'My Records'),
  other_records: () => t('other_records', 'Other Records'),

  my_incident: () => t('my_incident', ' My incident'),

  other_incident: () => t('other_incident', 'Other incident'),

  pending_closure_by_responder: () =>
    t('pending_closure_by_responder', 'Pending closure by Responder'),

  download_pdf: () => t('download_pdf', 'Download PDF'),

  report_cancelled: () =>
    t('report_cancelled', 'Your report has been successfully cancelled.'),

  image: () => t('image', 'Image'),

  mobile_required: () => t('mobile_required', 'Mobile number is required'),

  state_required: () => t('state_required', 'State is required'),

  street_required: () => t('street_required', 'Street is required'),

  success: () => t('success', 'Success'),

  incident_update: () => t('incident_update', 'Incident updated successfully.'),

  ok: () => t('ok', 'OK'),

  valid_pin_code: () => t('valid_pin_code', 'Enter valid 6-digit pin code'),

  email_required: () => t('email_required', 'Email is required'),

  complete: () => t('complete', 'Complete'),

  select_blood_group: () => t('select_blood_group', 'Select blood group'),

  dob_required: () => t('dob_required', 'Date of birth is required'),

  valid_email: () => t('valid_email', 'Enter valid email address'),
 
  termsAndConditions: () =>
    t('legal_terms_description', 'Legal Terms & Privacy'),
 
  responder_assigned_success: () =>
    t('responder_assigned_success', 'Responders Assigned Successfully'),

  failed_to_pick: () => t('failed_to_pick', 'Failed to pick image'),

  enter_city: () => t('enter_city', 'Enter city'),

  enter_tehsil: () => t('enter_tehsil', 'Enter tehsil'),

  select_block: () => t('select_block', 'Select block'),

  pdf_url_notavailable: () =>
    t('pdf_url_notavailable', 'PDF URL is not available'),
 
  assigned_reviewer_success: () =>
    t('assigned_reviewer_success', 'Assigned to reviewer successfully'),

  required_latitude: () => t('required_latitude', 'Latitude is required'),

  required_longitude: () => t('required_longitude', 'Longitude is required'),

};
