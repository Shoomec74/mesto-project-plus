import { HttpStatus } from '../utils/constants';

class ApiError extends Error {
  code: HttpStatus;

  constructor(code: HttpStatus, message: string) {
    super(message);
    this.code = code;
  }

  static authUserError(message: string) {
    return new ApiError(HttpStatus.BAD_AUTH, message);
  }

  static forbiddenError(message: string) {
    return new ApiError(HttpStatus.FORBIDDEN_TO_DELETE, message);
  }

  static serverError(message: string) {
    return new ApiError(HttpStatus.SERVER_ERROR, message);
  }

  static notFoundError(message: string) {
    return new ApiError(HttpStatus.NOT_FOUND, message);
  }

  static badRequestError(message: string) {
    return new ApiError(HttpStatus.BAD_REQUEST, message);
  }

  static dublicateError(message: string) {
    return new ApiError(HttpStatus.DUBLICATE_EMAIL, message);
  }
}

export default ApiError;
