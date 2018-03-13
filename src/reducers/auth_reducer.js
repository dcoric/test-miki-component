import { AUTH_USER, UNAUTH_USER, AUTH_ERROR, REQUEST_SENT, RESPONSE_RECEIVED } from '../components/actions/types';

export default function (state = {}, action) {
  let loading = 0;
  switch (action.type) {
    case AUTH_USER:
      return { ...state, authenticated: true, verify: false, token: action.token, error: false };
    case UNAUTH_USER:
      return { ...state, authenticated: false, verify: false, token: false };
    case AUTH_ERROR:
      return { ...state, error: action.payload, verify: false, token: false };
    case REQUEST_SENT:
      loading = state.requestProcessing || 0;
      loading += 1;
      return { ...state, requestProcessing: loading };
    case RESPONSE_RECEIVED:
      loading = state.requestProcessing || 0;
      if (loading > 0) {
        loading -= 1;
      }
      return { ...state, requestProcessing: loading };
    default:
      return state;
  }
}
