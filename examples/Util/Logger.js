import * as log from 'loglevel';

const logger = log.getLogger('app-logger');

// TODO Make configurable via app.config.js, NODE_ENV or similiar.
logger.setLevel('DEBUG');

export default logger;
