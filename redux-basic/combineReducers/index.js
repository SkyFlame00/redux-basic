module.exports = function combineReducers(reducers) {
  return (previousState, action) => {
    return Object.keys(reducers).reduce((state, key) => {
      state[key] = reducers[key](previousState[key], action);
      return state;
    }, {});
  }
}