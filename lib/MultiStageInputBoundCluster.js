'use strict';

const { BoundCluster } = require('zigbee-clusters');

class MultiStageInputBoundCluster extends BoundCluster {

  constructor({ reportAttributes }) {
    super();
    this._reportAttributes = reportAttributes;
  }

  reportAttributes(payload) {
    this._reportAttributes(payload);
  }

}

module.exports = MultiStageInputBoundCluster;
