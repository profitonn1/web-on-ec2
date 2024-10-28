import UnsupportedProtocolError from '../errors/UnsupportedProtocolError';

const sendRequest = (u, eb, y, f) => {
  try {
    let m = /^([-+\w]{1,25})(:?\/\/|:)/.exec(u.url);
    if (m && -1 === eb.protocols.indexOf(m[1])) {
      throw new UnsupportedProtocolError(`Unsupported protocol ${m[1]}: ${$.ERR_BAD_REQUEST}`);
    }
    y.send(f || null);
  } catch (error) {
    if (error instanceof UnsupportedProtocolError) {
      console.error("Protocol Error:", error.message);
    } else {
      console.error("Error sending request:", error);
    }
  }
};
