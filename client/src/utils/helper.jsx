import moment from 'moment';

export const antdFormRules = [
  {
    required: true,
    message: 'Required',
  },
];

export const getDateFormat = (date) => {
  return moment(date).format('MMM Do YYYY h:mm a');
};
