import { IGlobalState, modalName } from './model';

interface IState {
  [modalName]: IGlobalState;
}

export const getMessage = () => (state: IState) => state[modalName].messages;
