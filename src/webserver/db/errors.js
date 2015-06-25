export class ParametersError {
  constructor(message) {
    this.message = message
    this.stack = (new Error()).stack
  }
}
