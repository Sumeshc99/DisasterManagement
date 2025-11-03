import i18n from 'i18next';

const t = (key: any, def: string) => i18n.t(key, { defaultValue: def });

export const TEXT = {
  please_enter_your_mobile_telsil_name: () =>
    t(
      'please_enter_your_mobile_telsil_name',
      'Please enter your Mobile Number and Tehsil',
    ),
  enter_phone_number: () => t('enter_phone_number', 'Enter your phone number'),
  select_taluka: () => t('select_taluka', 'Select Tehsil'),
  login: () => t('login', 'Login'),
  please_enter_pin_code: () =>
    t('please_enter_pin_code', 'Please use your PIN code to log in'),
  forgot_pin: () => t('forgot_pin', 'Forgot PIN...'),
  resend_otp: () => t('resend_otp', 'Resend OTP'),
  next: () => t('next', 'Next'),
  otp_expire_in: () => t('otp_expire_in', 'OTP will expired in '),
  submit: () => t('submit', 'Submit'),

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
  Select_relation: () => t('Select relation', 'Select relation'),
  primary_mobile_number: () =>
    t('primary_mobile_number', 'Primary Mobile Number'),
  enter_primary_mobile_number: () =>
    t('enter_primary_mobile_number', 'Enter primary mobile number'),
  alternate_mobile_number: () =>
    t('alternate_mobile_number', 'Alternate Mobile Number'),
};
