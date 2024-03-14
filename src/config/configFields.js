import * as Yup from 'yup';
import { ADMISSION_COST_DEFAULT, ADMISSION_COST_RANGE, DEPOSIT_MIN } from './configBasics';

const NAME_REGEX = "^[^<>&@]+$";
const PRONOUNS_REGEX = "^[^<>&@]+$";
const PHONE_REGEX = "^[2-9][0-9-() ]*$";
export const NAME_VALIDATION = Yup.string().matches(NAME_REGEX, 'Invalid characters :(');
export const PRONOUNS_VALIDATION = Yup.string().matches(PRONOUNS_REGEX, 'Invalid characters :(');
export const EMAIL_VALIDATION = Yup.string().email('Invalid email address');
export const PHONE_VALIDATION = Yup.string().matches(PHONE_REGEX, 'Please enter a valid phone number.');

// this can include config for fields not used in this particular registration instance
export const FIELD_CONFIG = {
  first: {
    label: 'First name',
    validation: NAME_VALIDATION.required('Please enter first name.'),
    defaultValue: '',
    order: 1,
    width: 6,
    autoComplete: 'given-name'
  },
  last: {
    label: 'Last name',
    validation: NAME_VALIDATION.required('Please enter last name.'),
    defaultValue: '',
    order: 2,
    width: 6,
    autoComplete: 'family-name'
  },
  pronouns: {
    label: 'Pronouns (not shared)',
    validation: PRONOUNS_VALIDATION,
    defaultValue: '',
    order: 4,
    width: 12
  },
  nametag: {
    label: 'Name for roster',
    validation: NAME_VALIDATION,
    defaultValue: '',
    order: 3,
    width: 12
  },
  email: {
    label: 'Email',
    type: 'email',
    validation: EMAIL_VALIDATION.required('Please enter email address.'),
    defaultValue: '',
    order: 5,
    width: 6,
    autoComplete: 'email'
  },
  emailConfirmation: {
    label: 'Re-enter email',
    type: 'email',
    validation: EMAIL_VALIDATION.required('Please re-enter your email address.').oneOf([Yup.ref('email'), null], 'Email addresses must match.'),
    defaultValue: '',
    order: 6,
    width: 6,
    autoComplete: 'email'
  },
  phone: {
    label: 'Phone',
    type: 'tel',
    pattern: '###-###-####',
    placeholder: 'e.g. 555-555-5555',
    validation: PHONE_VALIDATION.required('Please enter phone number.'),
    defaultValue: '',
    order: 7,
    width: 12,
    // width: 4,
    autoComplete: 'tel'
  },
  address: {
    label: 'Street address',
    validation: Yup.string().required('Please enter street address.'),
    defaultValue: '',
    order: 8,
    width: 9,
    autoComplete: 'street-address'
  },
  apartment: {
    label: 'Apt, Suite, etc.',
    validation: Yup.string(),
    defaultValue: '',
    order: 9,
    width: 3,
    autoComplete: 'address-line2'
  },
  city: {
    label: 'City',
    validation: Yup.string().required('Please enter city.'),
    defaultValue: '',
    order: 10,
    width: 6,
    // width: 5,
    autoComplete: 'city'
  },
  state: {
    label: 'State / Province',
    validation: Yup.string().required('Please enter state or province.'),
    defaultValue: '',
    order: 11,
    width: 3,
    autoComplete: 'state'
  },
  zip: {
    label: 'Zip / Postal code',
    validation: Yup.string().required('Please enter zip/postal code.'),
    defaultValue: '',
    order: 12,
    width: 3,
    autoComplete: 'postal-code'
  },
  country: {
    label: 'Country',
    validation: Yup.string(),
    defaultValue: '',
    order: 13,
    width: 12,
    autoComplete: 'country',
    hidden: true
  },
  share: {
    title: "Roster",
    type: 'checkbox',
    label: "What information do you want shared in the roster?",
    options: [
      { label: 'Include my name in the roster', value: 'name' },
      { label: 'Include my email in the roster', value: 'email' },
      { label: 'Include my phone number in the roster', value: 'phone' },
      { label: 'Include my address in the roster', value: 'address' },
    ],
    validation: Yup.array(),
    defaultValue: ['name', 'email', 'phone', 'address'],
    order: 20,
  },
  carpool: {
    type: 'checkbox',
    title: "Transportation",
    label: "If you check any of these boxes we will be in touch closer to camp to coordinate. We will do our best to meet everyone's carpool needs. For housing, we will put people directly in touch with possible matches if there are any.  NOTE: historically, carpools and housing are tight. If you are able to offer a ride, please check the box!",
    options: [
      { label: "I can offer a ride to camp", value: 'offer-ride' },
      { label: "I might be able to give a ride to camp", value: 'offer-ride-maybe' },
      { label: "I need a ride to camp", value: 'need-ride' },
      { label: "I might need a ride to camp", value: 'need-ride-maybe' },
      { label: "I am willing and able to rent a car to drive to camp if necessary", value: 'rent-car' },
      { label: "I can offer a place to stay in the Bay Area before or after camp", value: 'offer-housing' },
      { label: "I could use help finding a place to stay in the Bay Area before or after camp", value: 'need-housing' },
    ],
    validation: Yup.array(),
    defaultValue: [],
    order: 25,
  },
  volunteer: {
    type: 'checkbox',
    title: "Volunteering",
    label: "Everyone will be asked to help with camp, but we need a few people who can commit in advance or in larger ways.",
    options: [
      { label: "I can come early to help with camp set up", value: 'before' },
      { label: "I can stay late to help with camp take down", value: 'after' },
      { label: "I can take on a lead volunteer role during camp (e.g. button maker or snack coordinator)", value: 'lead' },
      { label: "I can help coordinate in the months before camp (e.g. bedding)", value: 'bedding' },
    ],
    validation: Yup.array(),
    defaultValue: [],
    order: 40,
  },
  dietaryPreferences: {
    type: 'radio',
    title: "Dietary Preferences",
    label: "Please choose one.",
    options: [
      { label: 'Vegan', value: 'Vegan' },
      { label: 'Vegetarian', value: 'Vegetarian' },
      { label: 'No Red Meat', value: 'No Red Meat' },
      { label: 'Omnivore', value: 'Omnivore' },
    ],
    required: true,
    validation: Yup.string().required('Please select dietary preference.'),
    defaultValue: '',
    order: 21,
  },
  dietaryRestrictions: {
    type: 'checkbox',
    title: "Additional Dietary Restrictions",
    label: "Please note, we will try out best to accommodate you with the prepared meals, but the kitchen has limited options. They do their best,  but if you're very worried about your restrictions (if highly allergic, or highly specific requirements) we recommend bringing your own food as well. We have a refrigerator and storage space available for personal use that many campers use. There's room to elaborate on allergies or safety needs below.",
    options: [
      { label: 'Gluten-free', value: 'gluten' },
      { label: 'Soy-free', value: 'soy' },
      { label: 'Dairy-free', value: 'dairy' },
      { label: 'Kosher for Passover (stringent)', value: 'kosher-strict' },
      { label: "Kosher for Passover (chill, just won't eat bread)", value: 'kosher' },
      { label: 'Other (please explain in comments below)', value: 'other' },
    ],
    validation: Yup.array(),
    defaultValue: [],
    order: 22,
  },
  allergies: {
    type: 'textarea',
    title: 'Allergy / Safety Information',
    label: "So there's \"I don't eat gluten\" and then there's \"if a single crumb of gluten cross-contaminates my food I will be sick all weekend.\" Please elaborate as much are you need to feel comfortable that we know your safety and allergy needs. This can include non-food things as well.",
    validation: Yup.string(),
    defaultValue: '',
    order: 23,
    rows: 2
  },
  housing: {
    type: 'textarea',
    title: 'Camp housing needs or requests',
    label: "(e.g. accessibility needs, I plan on camping, etc.)",
    validation: Yup.string(),
    defaultValue: '',
    order: 41,
    rows: 2
  },
  roommate: {
    type: 'textarea',
    title: 'Room sharing preferences',
    label: "We now pre-assign housing and try our best to meet everyone's needs and preferences. If there are people you would like to room with, list their names here.",
    validation: Yup.string(),
    defaultValue: '',
    order: 42,
    rows: 2
  },
  scent: {
    type: 'radio',
    title: "Do you experience chemical/scent sensitivity?",
    label: "We are currently a scent conscious but not scent free event, and will do our best to meet your needs.",
    options: [
      { label: 'Yes, intensely', value: 'Yes, intensely' },
      { label: 'Yes, somewhat', value: 'Yes, somewhat' },
      { label: 'No', value: 'No' },
    ],
    validation: Yup.string(),
    defaultValue: '',
    order: 24,
  },
  photo: {
    type: 'radio',
    title: "Photo Consent",
    label: "People at Queer Camp take photos. Please let us know if you have any concerns about your photo being taken or posted publicly.",
    options: [
      { label: "Photos are fine!", value: 'Yes' },
      { label: "Photos are fine, but I don't want to be tagged online", value: 'No tags' },
      { label: "Please do not post photos of me.", value: 'No' },
      { label: "Other (please explain in comments below)", value: 'Other' },
    ],
    required: true,
    validation: Yup.string().required('Please select photo consent preference.'),
    defaultValue: '',
    order: 43,
  },
  bedding: {
    type: 'checkbox',
    title: "Bedding and Towels",
    label: "Campers will need a pillow, a towel, and sheets and blanket or a sleeping bag. If at all possible, please bring your own or arrange with a friend directly to borrow.",
    options: [
      { label: 'I can offer bedding and a towel to a camper from out of town', value: 'offer-bedding' },
      { label: 'I might be able to offer bedding and a towel', value: 'offer-bedding-maybe' },
      { label: 'I am coming from out of town and will need bedding and a towel', value: 'need-bedding' },
      { label: 'I might need bedding and a towel', value: 'need-bedding-maybe' },
    ],
    validation: Yup.array(),
    defaultValue: [],
    order: 26,
  },
  hospitality: {
    type: 'checkbox',
    title: "Housing",
    label: "Do you need housing or can you offer housing?",
    options: [
      { label: 'I can offer housing', value: 'offering' },
      { label: 'I need housing (limited availability)', value: 'requesting' },
    ],
    validation: Yup.array(),
    defaultValue: [],
    order: 23,
  },
  scholarship: {
    type: 'checkbox',
    title: "Scholarships (limited availability)",
    label: "We feel we've kept the price of camp remarkably low.  However, if you are limited financially, we have a small number of half price scholarships available for camp. If you'd like to be considered for one of these, please let us know.",
    options: [
      { label: 'Yes, please consider me for a scholarship', value: 'yes' },
    ],
    validation: Yup.array(),
    defaultValue: [],
    order: 29,
  },
  comments: {
    type: 'textarea',
    title: "Anything else?",
    label: "Tell us anything else you'd like us to know. We want to be sure we don't miss anything that could make the weekend welcoming and enjoyable.",
    validation: Yup.string(),
    defaultValue: '',
    rows: 5,
    order: 50,
  },
  admissionCost: {
    validation: Yup.number().min(DEPOSIT_MIN).max(ADMISSION_COST_RANGE[1]).required(),
    defaultValue: ADMISSION_COST_DEFAULT,
  },
}

export const PERSON_INPUT_LABELS = [ 'Your contact information', 'Second admission', 'Third admission', 'Fourth admission' ];
