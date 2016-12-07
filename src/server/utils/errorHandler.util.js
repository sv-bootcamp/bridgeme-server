export class errorHandler {
  constructor(error, options = {}) {
    this.error = error || undefined;
    this.err_point = options.err_point;
    this.statusCode = options.statusCode || 500;
    // this.message = options.message || 'Internal Server Error';
  }
}
