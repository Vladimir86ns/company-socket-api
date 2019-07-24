const deepstream = require( 'deepstream.io-client-js' );
let client = null;

const connect = () => {
  client = deepstream('127.0.0.1:6020', { silentDeprecation: true });
  setEventHandlers();
};

const setEventHandlers = () => {
  client.login(null, ( success ) => {
    if ( success ) {
      console.log('Websocket Login Success!');
    } else {
      console.log('Websocket Login Failed!');
    }
  });

  client.on( 'error', function( msg, event, topic ) {
    console.log('Websocket error event: ', event );
  });
};

const getConnection = () => {
  return client.event;
};

const sendEmitOnRoom = (room, data) => {
  client.event.emit(room, data);
};

module.exports = {
  connect,
  getConnection,
  sendEmitOnRoom,
};
