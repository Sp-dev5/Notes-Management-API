export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: any[]
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function errorResponse(statusCode: number, message: string, errors?: any[]) {
  return {
    success: false,
    error: message,
    errors,
    timestamp: new Date().toISOString(),
  };
}

export function successResponse(data: any, message = 'Success') {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}
