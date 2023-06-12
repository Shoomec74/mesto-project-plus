export enum HttpStatus {
  'OK' = 200,
  'CREATED' = 201,
  'BAD_REQUEST' = 400,
  'BAD_AUTH' = 401,
  'FORBIDDEN_TO_DELETE' = 403,
  'NOT_FOUND' = 404,
  'DUBLICATE_EMAIL' = 409,
  'SERVER_ERROR' = 500,
}

export const StatusMessages = {
  [HttpStatus.OK]: {
    User: 'OK - request successfully processed',
    Card: 'OK - request successfully processed',
    Login: 'Login successful',
  },
  [HttpStatus.CREATED]: {
    User: 'User successfully created',
    Card: 'Card successfully created',
  },
  [HttpStatus.BAD_REQUEST]: {
    User: 'Incorrect data was transmitted when creating a user',
    Card: 'Incorrect data was transmitted when creating a card',
    Email: 'Incorrect email or password',
  },
  [HttpStatus.BAD_AUTH]: {
    Login: 'Invalid email or password',
    Auth: 'Authorization error',
  },
  [HttpStatus.FORBIDDEN_TO_DELETE]: {
    Card: 'You can only delete your card',
  },
  [HttpStatus.NOT_FOUND]: {
    Users: 'Users not found',
    Cards: 'Cards not found',
    UserId: 'The user by the specified _id was not found',
    CardId: 'The card with the specified _id was not found',
    LikeCard: 'A nonexistent _id of the card was passed',
    Route: 'Route not found',
  },
  [HttpStatus.SERVER_ERROR]: {
    User: 'An error has occurred on the server',
    Card: 'An error has occurred on the server',
    Login: 'An error has occurred on the server',
  },
  [HttpStatus.DUBLICATE_EMAIL]: {
    User: 'A user with this email already exists',
  },
};
