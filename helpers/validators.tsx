export function emailValidator(email: string) {
    const re = /\S+@\S+\.\S+/
    if (!email) return "Email can't be empty."
    if (!re.test(email)) return 'Ooops! We need a valid email address.'
    return ''
  }

export function numberValidator(number: string) {
  const re = /^[1-9]\d*(\.\d+)?$/
  if (!number) return "Number can't be empty."
  if (!re.test(number)) return 'Ooops! We need a valid number.'
  return ''
}

export function monthDayValidator(number: string) {
  if(!number){
    return '';
  }
  if (parseInt(number) > 31) return "The number can't be grater than 31"
  return ''
}

export function passwordValidator(password: string) {
  if (!password) return "Password can't be empty.";
  if (password.length < 6)
    return 'Password must be at least 5 characters long.';
  return '';
}

export function inputValidator(value: string) {
  if (!value) return "Input can't be empty.";
  return '';
}