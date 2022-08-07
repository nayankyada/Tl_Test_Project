import moment from 'moment';

// regex for Email Address
export const regexForEmailAddress =
  // eslint-disable-next-line no-useless-escape, no-control-regex
  /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;

// regex for Mobile Number
export const regexForMobileNumber = /^[0-9]{10}$/;

/* Regex for strong password Explanation:
^                 # start-of-string
(?=.*[0-9])       # a digit must occur at least once
(?=.*[a-z])       # a lower case letter must occur at least once
(?=.*[A-Z])       # an upper case letter must occur at least once
(?=.*[@#$%^&+=])  # a special character must occur at least once
(?=\S+$)          # no whitespace allowed in the entire string
.{8,}             # anything, at least eight places though
$                 # end-of-string */
export const regexForPassword = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/;

// eslint-disable-next-line no-useless-escape
export const regexForName = /^[0-9A-Za-z\s\-]+$/;

/* Global Errors state Utils */
export const getErrorMessage = (errors, fieldName, fieldLabel) => {
  if (errors[fieldName]) {
    const { type } = errors[fieldName];
    switch (type) {
      case 'required':
        return `${fieldLabel} is required`;
      case 'sameAs':
        return 'Passwords does not match. Please try again.';
      case 'pattern':
        return `Invalid ${fieldLabel}`;
      case 'minLength':
        return `Please Enter At least 8 digit ${fieldLabel}`;
      default:
        return type;
    }
  } else {
    return false;
  }
};

export const enumerateDaysBetweenDates = (startDate, endDate) => {
  var dates = [];
  var currDate = moment(startDate).startOf('day');
  var lastDate = moment(endDate).startOf('day');
  dates.push(currDate.clone().toDate());
  while (currDate.add(1, 'days').diff(lastDate) <= 0) {
    dates.push(currDate.clone().toDate());
  }
  return dates;
};

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export const colors = [
  { value: 'black', label: 'Black' },
  { value: 'blue', label: 'Blue' },
  { value: 'red', label: 'Red' },
  { value: 'gray', label: 'Gray' },
  { value: 'orange', label: 'Orange' },
  { value: 'yellow', label: 'Yellow' }
];

export const location = [
  { value: 'surat', label: 'Surat' },
  { value: 'baroda', label: 'Baroda' },
  { value: 'gandhinagar', label: 'Gandhinagar' },
  { value: 'ahemdabad', label: 'Ahemdabad' }
];
