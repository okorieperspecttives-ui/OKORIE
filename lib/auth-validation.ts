export const EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export const PASSWORD_RULES = {
  minLength: 12,
  upper: /[A-Z]/,
  lower: /[a-z]/,
  number: /\d/,
  special: /[^A-Za-z0-9]/,
  noSpace: /^\S+$/,
} as const;

export function isValidEmail(email: string) {
  return EMAIL_PATTERN.test(email.trim());
}

export function getPasswordRuleStatus(password: string) {
  return {
    minLength: password.length >= PASSWORD_RULES.minLength,
    upper: PASSWORD_RULES.upper.test(password),
    lower: PASSWORD_RULES.lower.test(password),
    number: PASSWORD_RULES.number.test(password),
    special: PASSWORD_RULES.special.test(password),
    noSpace: PASSWORD_RULES.noSpace.test(password),
  };
}

export function getPasswordErrors(password: string) {
  const status = getPasswordRuleStatus(password);
  const errors: string[] = [];

  if (!status.minLength) errors.push("At least 12 characters");
  if (!status.upper) errors.push("At least 1 uppercase letter");
  if (!status.lower) errors.push("At least 1 lowercase letter");
  if (!status.number) errors.push("At least 1 number");
  if (!status.special) errors.push("At least 1 special character");
  if (!status.noSpace) errors.push("No spaces allowed");

  return errors;
}
