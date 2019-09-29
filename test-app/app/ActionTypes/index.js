const Types = require('../Types');

const applyFilterAction = filterValue => ({
  type: Types.APPLY_FILTER,
  filterValue
});

module.exports = {
  applyFilterAction
};