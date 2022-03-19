import { emailValidator, inputValidator, passwordValidator } from '../validators';

describe('Emails', () => {
  it('should return empty string if email is valid', () => {
    const result = emailValidator('test@test.com');
    expect(result).toBe('');
  });

  it('should empty error if email is empty', () => {
    const result = emailValidator('');
    expect(result).toBe("Email can't be empty.");
  });

  it('should valid error if email is not valid', () => {
    const result = emailValidator('test@test');
    expect(result).toBe('Ooops! We need a valid email address.');
  });
});

describe('Passwords', () => {
  it('should return empty string if password is valid', () => {
    const result = passwordValidator('123456');
    expect(result).toBe('');
  });

  it('should return empty error if password is empty', () => {
    const result = passwordValidator('');
    expect(result).toBe("Password can't be empty.");
  });

  it('should return length error if password is too short', () => {
    const result = passwordValidator('123');
    expect(result).toBe("Password must be at least 5 characters long.");
  });
});

describe('Inputs', () => {
  it('should return undefined if no error', () => {
    const result = inputValidator('123');
    expect(result).toBe(undefined);
  })

  it('should return empty error if input is empty', () => {
    const result = inputValidator('');
    expect(result).toBe("Input can't be empty.");
  })
})
