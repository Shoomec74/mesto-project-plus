export enum HttpStatus {
  "OK" = 200,
  "CREATED" = 201,
  "BAD_REQUEST" = 400,
  "NOT_FOUND" = 404,
  "SERVER_ERROR" = 500,
}

export const StatusMessages = {
  [HttpStatus.OK]: {
    User: 'OK - request successfully processed',
    Card: 'OK - request successfully processed',
  },
  [HttpStatus.CREATED]: {
    User: 'User successfully created',
    Card: 'Card successfully created',
  },
  [HttpStatus.BAD_REQUEST]: {
    User: 'Incorrect data was transmitted when creating a user',
    Card: 'Incorrect data was transmitted when creating a card',
  },
  [HttpStatus.NOT_FOUND]: {
    Users: 'Users not found',
    Cards: 'Cards not found',
    UserId: 'The user by the specified _id was not found',
    CardId: 'The card with the specified _id was not found',
    LikeCard: 'A nonexistent _id of the card was passed',
  },
  [HttpStatus.SERVER_ERROR]: {
    User: 'An error occurred while processing the user',
    Card: 'An error occurred while processing the card',
  },
};
