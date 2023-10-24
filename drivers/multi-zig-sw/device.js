'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { debug } = require('zigbee-clusters');
const MultiStageInputBoundCluster = require('../../lib/MultiStageInputBoundCluster');

debug(true);
class Device extends ZigBeeDevice {

  async onNodeInit({ zclNode }) {

    // Listen for battery updates
    zclNode.endpoints[1].clusters.powerConfiguration.on('attr.batteryVoltage', (data) => {
      const voltage = data * 100;
      const battery = (voltage - 2200) / 8;
      const batteryPercent = battery > 100 ? 100 : battery;
      this.setCapabilityValue('measure_battery', batteryPercent).catch(this.error);
    });

    // Bind on/off cluster
    const multiStateEndpoints = [2, 3, 4, 5];
    multiStateEndpoints.forEach((endpoint, index) => {
      zclNode.endpoints[endpoint].bind(
        'multistateInput',
        new MultiStageInputBoundCluster({
          reportAttributes: (payload) => {
            this._toggleCommandHandler(index);
          },
        }),
      );
    });
  }

  _toggleCommandHandler(btnNumber) {
    this.triggerFlow({ id: `toggled-${btnNumber}` })
      .then(() => this.log('flow was triggered', 'toggled'))
      .catch((err) => this.error('Error: triggering flow', 'toggled', err));
  }

}

module.exports = Device;
