class UnsupportedProtocolError extends Error {
    constructor(message) {
      super(message);
      this.name = 'UnsupportedProtocolError'; // Specify the name of the error
    }
  }
  
  export default UnsupportedProtocolError;
  