export function emailValidator(email: string) {
    const re = /\S+@\S+\.\S+/
    if (!email) return "Email can't be empty."
    if (!re.test(email)) return 'Ooops! We need a valid email address.'
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
  return undefined;
}