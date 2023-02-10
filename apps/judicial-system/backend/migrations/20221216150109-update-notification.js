'use strict'
const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  up: (queryInterface) => {
    // replaceEnum does not support transactions
    return replaceEnum({
      queryInterface,
      tableName: 'notification',
      columnName: 'type',
      newValues: [
        'HEADS_UP',
        'READY_FOR_COURT',
        'RECEIVED_BY_COURT',
        'COURT_DATE',
        'RULING',
        'MODIFIED',
        'REVOKED',
        'DEFENDER_ASSIGNED',
        'DEFENDANTS_NOT_UPDATED_AT_COURT', // new value
      ],
      enumName: 'enum_notification_type',
    })
  },

  down: (queryInterface) => {
    // replaceEnum does not support transactions
    return replaceEnum({
      queryInterface,
      tableName: 'notification',
      columnName: 'type',
      newValues: [
        'HEADS_UP',
        'READY_FOR_COURT',
        'RECEIVED_BY_COURT',
        'COURT_DATE',
        'RULING',
        'MODIFIED',
        'REVOKED',
        'DEFENDER_ASSIGNED',
      ],
      enumName: 'enum_notification_type',
    })
  },
}
