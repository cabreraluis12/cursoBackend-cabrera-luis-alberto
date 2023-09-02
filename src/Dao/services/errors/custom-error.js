export default class CustomError extends Error {
  constructor({ message, name = "CustomError", cause, code = 500 }) {
    super(message); 
    this.name = name;
    this.cause = cause;
    this.code = code;
  }

  static createError({ name = "CustomError", message, cause, code = 500 }) {
    return new CustomError({ message, name, cause, code });
  }
}