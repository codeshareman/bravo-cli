import model from './model';
import { createDynamicModule } from 'common/utils';
import * as selectors from './selectors';

export const globalMessageModule = createDynamicModule(model);

export { selectors };
export default model;
