/*globals define, WebGMEGlobal*/

/**
 * Generated by VisualizerGenerator 1.7.0 from webgme on Sat Dec 03 2022 09:34:36 GMT+0000 (Coordinated Universal Time).
 */
define(['css!./styles/PeNDeSSimulatorWidget.css'], function () {
  'use strict';

    var WIDGET_CLASS = 'pe-n-de-s-simulator';

    function PeNDeSSimulatorWidget(logger, container) {
        this._logger = logger.fork('Widget');

        this._el = container;

        this.nodes = {};
        this._initialize();

	let self = this;

        this._logger.debug('ctor finished');
    }

    PeNDeSSimulatorWidget.prototype._initialize = function () {
        var width = this._el.width(),
            height = this._el.height(),
            self = this;

        // set widget class
        this._el.addClass(WIDGET_CLASS);

        // Create a dummy header
        //this._el.append('<h3>PeNDeSSimulator Events:</h3>');

        // Registering to events can be done with jQuery (as normal)
        this._el.on('dblclick', function (event) {
            event.stopPropagation();
            event.preventDefault();
            self.onBackgroundDblClick();
        });
    };

    PeNDeSSimulatorWidget.prototype.onWidgetContainerResize = function (width, height) {
        this._logger.debug('Widget is resizing...');
    };

    // Adding/Removing/Updating items
    PeNDeSSimulatorWidget.prototype.addNode = function (desc) {
        if (desc) {
	    this.nodes[desc.id] = desc;
        }
    };

    PeNDeSSimulatorWidget.prototype.removeNode = function (gmeId) {
        var desc = this.nodes[gmeId];
        delete this.nodes[gmeId];
    };

    PeNDeSSimulatorWidget.prototype.updateNode = function (desc) {
        if (desc) {
            this._logger.debug('Updating node:', desc);
        }
    };

    /* * * * * * * * Visualizer event handlers * * * * * * * */

    PeNDeSSimulatorWidget.prototype.onNodeClick = function (/*id*/) {
        // This currently changes the active node to the given id and
        // this is overridden in the controller.
    };

    PeNDeSSimulatorWidget.prototype.onBackgroundDblClick = function () {
    };

    /* * * * * * * * Visualizer life cycle callbacks * * * * * * * */
    PeNDeSSimulatorWidget.prototype.destroy = function () {
    };

    PeNDeSSimulatorWidget.prototype.onActivate = function () {
        this._logger.debug('PeNDeSSimulatorWidget has been activated');
    };

    PeNDeSSimulatorWidget.prototype.onDeactivate = function () {
        this._logger.debug('PeNDeSSimulatorWidget has been deactivated');
    };

    return PeNDeSSimulatorWidget;
});
