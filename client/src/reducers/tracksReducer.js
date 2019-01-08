import { GET_TRACKS } from '../actions/types';

export default function(state = [], action) {
  switch (action.type) {
    case GET_TRACKS:
      return action.payload || false;

    default:
      return state;
  }
}
