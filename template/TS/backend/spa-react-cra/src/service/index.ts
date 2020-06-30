import instance from './instance';
import ConfigurationService from 'service/api/configurationService';

const config = new ConfigurationService(instance);

export { config };
