import reducer, { INITIAL_STATE } from '~/store/modules/techs/reducer';
import * as TechsActions from '~/store/modules/techs/actions';

describe('Techs reducer', () => {
  it('DEFAULT', () => {
    const state = reducer(undefined, {});

    expect(state).toStrictEqual(INITIAL_STATE);
  });

  it('ADD_TECH', () => {
    const state = reducer(INITIAL_STATE, TechsActions.addTech('Node.js'));

    expect(state).toStrictEqual(['Node.js']);
  });
});
