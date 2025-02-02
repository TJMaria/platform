import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { createActionGroupKeepCasing } from '../src/action_group_creator';

describe('createActionGroup', () => {
  const authApiActions = createActionGroup({
    source: 'Auth API',
    events: {
      'Login Success': props<{ userId: number; token: string }>(),
      'Login Failure': props<{ error: string }>(),
      'Logout Success': emptyProps(),
      'Logout Failure': (error: Error) => ({ error }),
    },
  });
  const booksApiActions = createActionGroup({
    source: 'Books API',
    events: {
      ' Load BOOKS  suCCess  ': emptyProps(),
    },
  });

  const authorApiActions = createActionGroupKeepCasing({
    source: 'Author API keep casing',
    events: {
      loadAuthors: emptyProps(),
      loadAuthorsSUCceS: emptyProps(),
      loadAuthorsFailed: emptyProps(),
      'reload authors': emptyProps(),
    },
  });

  it('should create action name by camel casing the event name', () => {
    expect(booksApiActions.loadBooksSuccess).toBeDefined();
  });

  it('should create action type using the "[Source] Event" pattern', () => {
    expect(booksApiActions.loadBooksSuccess().type).toBe(
      '[Books API]  Load BOOKS  suCCess  '
    );
  });

  it('should create action name by camel casing the event name', () => {
    expect(authorApiActions.loadAuthors).toBeDefined();
    expect(authorApiActions.loadAuthorsSUCceS).toBeDefined();
    expect(authorApiActions.loadAuthorsFailed).toBeDefined();
    expect(authorApiActions.reloadauthors).toBeDefined();
  });

  it('should create action type using the "[Source] Event" pattern', () => {
    expect(authorApiActions.loadAuthors().type).toBe(
      '[Author API keep casing] loadAuthors'
    );
  });

  it('should create action with props', () => {
    const loginSuccess = authApiActions.loginSuccess({
      userId: 10,
      token: 'ngrx',
    });
    expect(loginSuccess).toEqual({
      type: '[Auth API] Login Success',
      userId: 10,
      token: 'ngrx',
    });

    const loginFailure = authApiActions.loginFailure({
      error: 'Login Failure!',
    });
    expect(loginFailure).toEqual({
      type: '[Auth API] Login Failure',
      error: 'Login Failure!',
    });
  });

  it('should create action without props', () => {
    const logoutSuccess = authApiActions.logoutSuccess();
    expect(logoutSuccess).toEqual({ type: '[Auth API] Logout Success' });
  });

  it('should create action with props factory', () => {
    const error = new Error('Logout Failure!');
    const logoutFailure = authApiActions.logoutFailure(error);
    expect(logoutFailure).toEqual({
      type: '[Auth API] Logout Failure',
      error,
    });
  });
});
