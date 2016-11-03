/**
 * @ngdoc module
 * @name material.components.popover
 */
angular
    .module('material.components.popover', [
      'material.core',
      'material.components.panel'
    ])
    .service('$mdPopover', MdPopoverService)
    .service('$mdPopoverRegistry', MdPopoverRegistryService)
    .directive('mdPopover', MdPopoverDirective);


/*****************************************************************************
 *                       MdPopover Service Documentation                     *
 *****************************************************************************/


/**
 * @ngdoc service
 * @name $mdPopover
 * @module material.components.popover
 * @description
 * `$mdPopover` is a helper service for handling the positioning, event binding,
 * watchers, and building of popovers and tooltips.
 */


/*****************************************************************************
 *                     MdPopover Reference Documentation                     *
 *****************************************************************************/


/**
 * @ngdoc type
 * @name MdPopoverRef
 * @module material.components.popover
 * @description
 * A reference to the created popover.
 */


/*****************************************************************************
 *                  MdPopover Registry Service Documentation                 *
 *****************************************************************************/


/**
 * @ngdoc service
 * @name $mdPopoverRegistry
 * @module material.components.popover
 * @description
 * `$mdPopoverRegistry` is a service that is used to reduce the amount of
 * listeners that are being registered on the `window` by the popover component.
 * Works by collecting the individual event handlers and dispatching them from
 * a global handler.
 */


/*****************************************************************************
 *                     MdPopover Directive Documentation                     *
 *****************************************************************************/


/**
 * @ngdoc directive
 * @name mdPopover
 * @module material.components.popover
 * @description
 * Popovers are used to describe elements by providing sophisticated, rich
 * content that may be fully interactive.
 *
 * Place a `<md-popover>` as a child of the element it describes.
 *
 * A popover will activate when the user interacts with the parent element with
 * one of the open triggers and will deactivate after one of the close triggers.
 *
 * @usage
 * <hljs lang="html">
 *   <div layout="column" style="text-align: center">
 *     <img class="md-border-radius-round" src="img/100-2.jpeg" width="100" />
 *     <h1 class="md-title">Miscellaneous Title</h1>
 *     <p><strong>Miscellaneous Subtitle</strong></p>
 *     <md-popover>
 *       <md-popover-title>Some cool title</md-popover-title>
 *       <md-popover-content>Some cool content.</md-popover-content>
 *     </md-popover>
 *   </div>
 * </hljs>
 *
 * @param {number=} md-z-index The visual level that the popover will appear
 *     in comparison with the rest of the elements of the application. Defaults
 *     to `100`.
 * @param {boolean=} md-enabled Is the popover enabled? Value will enable or
 *     disable the configured `md-open-trigger`. Defaults to `true`.
 * @param {expression=} md-visible Boolean value bound to an expression of
 *     whether or not the popover is currently visible. Defaults to `false`.
 * @param {string=} md-popover-class Custom class to be applied to the popover.
 * @param {boolean=} md-animated Should the popover fade and scale in and out?
 *     Defaults to `true`.
 * @param {string=} md-open-trigger What should trigger the showing of the
 *     popover? Supports a space-seperated list of event names. Defaults to
 *     `mouseenter touchstart focus`. Accepts:
 *
 *   - mouseenter
 *   - click
 *   - focus
 *   - touchstart
 * @param {string=} md-close-trigger What should trigger the hiding of the
 *     popover? Supports a space separated list of event names. Defaults to
 *     `mouseleave touchcancel blur`. Accepts:
 *
 *   - mouseleave
 *   - click
 *   - outsideClick
 *   - escapeKeyPress
 *   - blur
 *   - touchcancel
 * @param {number=} md-open-delay How many milliseconds to wait to show the
 *     popover after the user interacts with the parent element. Defaults to
 *     `0`ms on non-touch devices and `75`ms on touch devices.
 * @param {number=} md-close-delay How many milliseconds to wait to hide the
 *     popover after the user completes the necessary interaction. Defaults to
 *     `0`ms.
 * @param {string=} md-position The position of the popover relative to the
 *     parent element. Defaults to `top`. Accepts the following:
 *
 *   - `top` - Popover on top, horizontally centered on parent element.
 *   - `right` - Popover on right, vertically centered on parent element.
 *   - `bottom` - Popover on bottom, horizontally centered on parent element.
 *   - `left` - Popover on left, vertically centered on parent element.
 */


/*****************************************************************************
 *                      MdPopover Service Implementation                     *
 *****************************************************************************/


/**
 * A service that handles the configuration of the popover and its events and
 * watchers.
 * @param {!angular.Scope} $rootScope
 * @param {!angular.$injector} $injector
 * @final @constructor @ngInject
 */
function MdPopoverService($rootScope, $injector) {
  // Injected variables.
  /** @private @const {!angular.Scope} */
  this._$rootScope = $rootScope;

  /** @private @const {!angular.$injector} */
  this._$injector = $injector;

  /** @private @const {!$mdUtil} */
  this._$mdUtil = $injector.get('$mdUtil');

  /** @private @const {!$mdPanel} */
  this._$mdPanel = $injector.get('$mdPanel');

  // Private variables.
  /** @private @const {!Object|undefined} */
  this._config;

  /**
   * Default config options for the popover's scope. Anything Angular related
   * needs to be done later.
   * @private @const {!Object}
   */
  this._defaultScopeOptions = {
    zIndex: 100,
    enabled: true,
    visible: false,
    animated: true,
    openTrigger: 'mouseenter touchstart focus',
    closeTrigger: 'mouseleave touchcancel blur',
    openDelay: 0,
    closeDelay: 0,
    positionPopover: 'top',
    positionTooltip: 'bottom'
  };

  /**
   * The possible positions of the popover. Each position is an object
   * containing an `x` and `y` reference to a `MdPanelPosition` API option.
   * @private @const {!object}
   */
  this._positions = {
    'top': {
      x: this._$mdPanel.xPosition.CENTER,
      y: this._$mdPanel.yPosition.ABOVE
    },
    'right': {
      x: this._$mdPanel.xPosition.OFFSET_END,
      y: this._$mdPanel.yPosition.CENTER
    },
    'bottom': {
      x: this._$mdPanel.xPosition.CENTER,
      y: this._$mdPanel.yPosition.BELOW
    },
    'left': {
      x: this._$mdPanel.xPosition.OFFSET_START,
      y: this._$mdPanel.yPosition.CENTER
    }
  };
}


/**
 * Creates the popover and assigns the creation result to a popover reference.
 * @param {!angular.Scope} scope
 * @param {!angular.JQLite} element
 * @param {!Object} attrs
 * @return {!MdPopoverRef}
 */
MdPopoverService.prototype.create = function(scope, element, attrs) {
  var isTooltip = element[0].nodeName === 'MD-TOOLTIP';

  this._config = {
    scope: this._setDefaultScope(scope, isTooltip),
    isTooltip: isTooltip,
    element: element,
    parentElement: this._$mdUtil.getParentWithPointerEvents(element),
    attrs: attrs,
    position: null,
    positionClass: null,
    panelPosition: null,
    panelRef: null,
    parentAriaLabel: null
  };

  var popoverRef = new MdPopoverRef(this._$injector, this._positions,
      this._config);

  // If the popover is enabled, move forward with all of its functionality.
  if (popoverRef._config.scope.mdEnabled) {
    element.detach();

    popoverRef
        ._updatePosition()
        ._addEventListeners();

    this._config.scope.$on('$destroy',
        angular.bind(popoverRef, popoverRef._destroy));
    this._config.element.one('$destroy',
        angular.bind(popoverRef, popoverRef._destroy));
    this._config.parentElement.one('$destroy',
        angular.bind(popoverRef, popoverRef._destroy));
  }

  return popoverRef;
}


/**
 * Sets the default configuration for the popover scope. Uses the scope from the
 * popover directive or creates a new child scope from `$rootScope`.
 * @param {!angular.Scope} scope
 * @param {Boolean} isTooltip
 * @returns {!angular.Scope}
 * @private
 */
MdPopoverService.prototype._setDefaultScope = function(scope, isTooltip) {
  scope = scope || this_$rootScope.$new();
  var options = this._defaultScopeOptions;

  scope.mdZIndex = scope.mdZIndex || options.zIndex;
  scope.mdEnabled = scope.mdEnabled || options.enabled;
  scope.mdVisible = scope.mdVisible || options.visible;
  scope.mdAnimated = scope.mdAnimated || options.animated;
  scope.mdOpenTrigger = scope.mdOpenTrigger || options.openTrigger;
  scope.mdCloseTrigger = scope.mdCloseTrigger || options.closeTrigger;
  scope.mdOpenDelay = scope.mdOpenDelay || options.openDelay;
  scope.mdCloseDelay = scope.mdCloseDelay || options.closeDelay;
  scope.mdPosition = !this._positions[scope.mdPosition] ?
      isTooltip ? options.positionTooltip : options.positionPopover :
      scope.mdPosition;

  return scope;
};


/*****************************************************************************
 *                     MdPopover Reference Implementation                    *
 *****************************************************************************/


/**
 * Represents a popover element.
 * @param {!angular.$injector} $injector
 * @param {!Object} positions
 * @param {!Object} config
 */
function MdPopoverRef($injector, positions, config) {
  // Injected variables.
  /** @private @const {!angular.$window} */
  this._$window = $injector.get('$window');

  /** @private @const {!angular.$document} */
  this._$document = $injector.get('$document');

  /** @private @const {!angular.$timeout} */
  this._$timeout = $injector.get('$timeout');

  /** @private @const {!angular.$log} */
  this._$log = $injector.get('$log');

  /** @private @const {!angular.$$rAF} */
  this._$$rAF = $injector.get('$$rAF');

  /** @private @const {!angular.$interpolate} */
  this._$interpolate = $injector.get('$interpolate');

  /** @private @const {!angular.$injector} */
  this._$q = $injector.get('$q');

  /** @private @const {!$mdUtil} */
  this._$mdUtil = $injector.get('$mdUtil');

  /** @private @const {!$mdPanel} */
  this._$mdPanel = $injector.get('$mdPanel');

  /** @private @const {!$mdPopoverRegistry} */
  this._$mdPopoverRegistry = $injector.get('$mdPopoverRegistry');

  // Private variables.
  /** @private @const {!Object|undefined} */
  this._positions = positions;

  /** @private @const {!Object|undefined} */
  this._config = config;

  /** @private @const {!Array<Function>|undefined} */
  this._removeListeners = [];

  /** @private @const {!Function|undefined} */
  this._openTimeout;

  /** @private @const {!Function|undefined} */
  this._closeTimeout;

  /** @private @const {!Function|undefined} */
  this._disabledAttributeObserver;

  /** @private @const {!Function|undefined} */
  this._visibleAttributeObserver;

  /** @private @const {!Function|undefined} */
  this._visibleWatcher;

  /** @private @const {!Function|undefined} */
  this._positionWatcher;

  /** @private @const {!Function|undefined} */
  this._ariaLabelWatcher;

  /** @private @const {!Boolean} */
  this._elementFocusedOnWindowBlur = false;

  /** @private @const {!Boolean} */
  this._autohide = false;
}


/**
 * Destroys the popover.
 * @private
 */
MdPopoverRef.prototype._destroy = function() {
  this._setVisible(false);
  this._config.panelRef && this._config.panelRef.destroy();
  this._config.element && this._config.element.remove();
  this._disabledAttributeObserver &&
      this._disabledAttributeObserver.disconnect();
  this._visibleAttributeObserver && this._visibleAttributeObserver.disconnect();
  this._visibleWatcher && this._visibleWatcher();
  this._positionWatcher && this._positionWatcher();
  this._ariaLabelWatcher && this._ariaLabelWatcher();
  this._removeEventListeners();
};


/**
 * Updates the position of the popover. The position class and `MdPanelPosition`
 * are configured using the current `mdPosition` on the scope.
 * @return {!MdPopoverRef}
 * @private
 */
MdPopoverRef.prototype._updatePosition = function() {
  // If the panel has already been created, remove the current position class
  // from the panel element.
  if (this._config.panelRef && this._config.panelRef.panelEl) {
    this._removeAllPositionClasses();
  }

  // Set the panel position based off of the current `scope.mdPosition`.
  this._config.positionClass = 'md-position-' + this._config.scope.mdPosition;
  this._config.position = this._positions[this._config.scope.mdPosition];
  this._config.panelPosition = this._$mdPanel.newPanelPosition()
      .relativeTo(this._config.parentElement)
      .addPanelPosition(this._config.position.x, this._config.position.y);

  // If the panel has already been created, add the new position class to the
  // panel element and update it's position with the new panel position.
  if (this._config.panelRef && this._config.panelRef.panelEl) {
    this._config.panelRef.panelEl.addClass(this._config.positionClass);
    this._config.panelRef.updatePosition(this._config.panelPosition);
  }

  return this;
};


/**
 * Removes all position classes from the panelRef panelEL.
 * @private
 */
MdPopoverRef.prototype._removeAllPositionClasses = function() {
  var self = this;

  angular.forEach(this._positions, function(value, key) {
    self._config.panelRef.panelEl.removeClass('md-position-' + key);
  });
};


/**
 * Listen for events that affect the popover.
 * @returns {!MdPopoverRef}
 * @private
 */
MdPopoverRef.prototype._addEventListeners = function() {
  this._configureDisabledWatcher();
  this._configureVisibleWatcher();
  this._configurePositionWatcher();
  this._configureAriaLabelWatcher();
  this._configureOpenTriggers();
  this._configureCloseTriggers();
  return this;
};


/**
 * Removes event listeners added within `_addEventListeners`.
 * @return {!MdPopoverRef}
 */
MdPopoverRef.prototype._removeEventListeners = function() {
  this._removeListeners && this._removeListeners.forEach(function(removeFn) {
    removeFn();
  });
  this._removeListeners = [];
};


/**
 * Configures a mutation observer where there is support for it to determine if
 * the parent element is disabled, which would disable the popover.
 * @private
 */
MdPopoverRef.prototype._configureDisabledWatcher = function() {
  var self = this;

  if (this._config.parentElement[0] && 'MutationObserver' in this._$window) {
    var isDisabledMutation = function(mutations) {
      mutations.some(function(mutation) {
        return mutation.attributeName === 'disabled' &&
            self._config.parentElement[0].disabled;
      });
    };

    this._disabledAttributeObserver = new MutationObserver(function(mutations) {
      if (isDisabledMutation(mutations)) {
        self._$mdUtil.nextTick(function() {
          self._setVisible(false);
        });
      }
    });

    this._disabledAttributeObserver.observe(this._config.parentElement[0], {
      attributes: true
    });
  }
};


/**
 * Configures a mutation observer where there is support for it to watch for
 * `mdVisible` to change.
 * @private
 */
MdPopoverRef.prototype._configureVisibleWatcher = function() {
  var self = this;

  var handlerFn = function(isVisible) {
    self._onVisibleChanged(isVisible);
  };

  if (this._config.element[0] && 'MutationObserver' in this._$window) {
    this._visibleAttributeObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'md-visible' && !self._visibleWatcher) {
          self._visibleWatcher = self._config.scope.$watch('mdVisible',
              handlerFn);
        }
      });
    });

    this._visibleAttributeObserver.observe(this._config.element[0], {
      attributes: true
    });

    // Build watcher only if mdVisible is being used in the attrs.
    if (this._config.attrs.hasOwnProperty('mdVisible')) {
      this._visibleWatcher = this._config.scope.$watch('mdVisible', handlerFn);
    }
  } else {
    // MutationObserver is not supported.
    this._visibleWatcher = this._config.scope.$watch('mdVisible', handlerFn);
  }
};


/**
 * Sets up a watcher for `mdPosition`.
 * @private
 */
MdPopoverRef.prototype._configurePositionWatcher = function() {
  var self = this;

  var handlerFn = function() {
    self._updatePosition();
  };

  this._positionWatcher = this._config.scope.$watch('mdPosition', handlerFn);
};


/**
 * Sets up a watcher for the aria-label.
 * @private
 */
MdPopoverRef.prototype._configureAriaLabelWatcher = function() {
  var self = this;

  var handlerFn = function(override) {
    self._addAriaLabelToParent(override);
  };

  this._ariaLabelWatcher = this._config.scope.$watch(function() {
    return self._config.element[0].textContent.trim();
  }, handlerFn);
};


/**
 * Sets the open trigger event listeners.
 * @private
 */
MdPopoverRef.prototype._configureOpenTriggers = function() {
  var self = this;

  var handlerFn = function(ev) {
    // Prevent the popover from opening when the window is receiving focus.
    if (ev.type === 'focus' && self._elementFocusedOnWindowBlur) {
      self._elementFocusedOnWindowBlur = false;
    } else if (!self._config.scope.mdVisible) {
      self._updatePosition();
      self._setVisible(true);
    }
  };

  this._config.parentElement.on(this._config.scope.mdOpenTrigger, handlerFn);

  this._removeListeners.push(function() {
    self._config.parentElement.off(self._config.scope.mdOpenTrigger, handlerFn);
  });
};


/**
 * Sets the close trigger event listeners.
 * @private
 */
MdPopoverRef.prototype._configureCloseTriggers = function() {
  var self = this;

  var handlerFn = function() {
    self._autohide = self._config.scope.hasOwnProperty('mdAutohide') ?
        self._config.scope.mdAutohide :
        self._config.attrs.hasOwnProperty('mdAutohide');

    if (self._autohide ||
        self._$document[0].activeElement !== self._config.parentElement[0]) {
      // When an open timeout is currently in progress, then we have to cancel
      // it, otherwise the popover will remain open without focus or hover.
      if (self._openTimeout) {
        self._$timeout.cancel(self._openTimeout);
        self._setVisible.queued = false;
        self._openTimeout = null;
      }

      self._setVisible(false);
    }
  };

  this._config.parentElement.on(this._config.scope.mdCloseTrigger, handlerFn);

  this._removeListeners.push(function() {
    self._config.parentElement.off(self._config.scope.mdCloseTrigger, handlerFn);
  });
};


/**
 * Sets the popover to visible or not.
 * @param {Boolean} isVisible
 * @private
 */
MdPopoverRef.prototype._setVisible = function(isVisible) {
  var self = this;

  // Break if the passed-in isVisible value is already in queue or there is no
  // queue and passed-in isVisible value is current in the controller.
  if (this._setVisible.queued &&
      this._setVisible.value === !!isVisible ||
      !this._setVisible.queued &&
      this._config.scope.mdVisible === !!isVisible) {
    return;
  }
  this._setVisible.value = !!isVisible;

  if (!this._setVisible.queued) {
    if (isVisible) {
      this._setVisible.queued = true;
      this._openTimeout = this._$timeout(function() {
        self._config.scope.mdVisible = self._setVisible.value;
        self._setVisible.queued = false;
        self._openTimeout = null;
        if (!self._visibleWatcher) {
          self._onVisibleChanged(self._config.scope.mdVisible);
        }
      }, self._config.scope.mdOpenDelay);
    } else {
      this._closeTimeout = this._$timeout(function() {
        self._config.scope.mdVisible = self._setVisible.value;
        self._closeTimeout = null;
        if (!self._visibleWatcher) {
          self._onVisibleChanged(self._config.scope.mdVisible);
        }
      }, self._config.scope.mdCloseDelay);
    }
  }
};


/**
 * Handles popover visiblility changes.
 * @param {Boolean} isVisible
 * @private
 */
MdPopoverRef.prototype._onVisibleChanged = function(isVisible) {
  isVisible ? this._open() : this._close();
};


/**
 * Configures the `_panelRef` with the `$mdPanel` API and then calls open.
 * @private
 */
MdPopoverRef.prototype._open = function() {
  var self = this;

  // If this is a tooltip, throw if the tooltip's text is empty.
  if (this._config.isTooltip && !this._config.element[0].textContent.trim()) {
    throw new Error('mdTooltip: Text for the tooltip has not been provided. ' +
        'Please include text within the mdTooltip element.');
  }

  this._buildPanelRef();
  this._addAriaLabelToParent();

  this._config.panelRef.open().then(function() {
    self._config.panelRef.panelEl.attr('role',
        self._config.isTooltip ? 'tooltip' : 'popover');
  });
};


/**
 * Builds the panel ref based off the scope configuration and whether or not it
 * is a tooltip.
 * @private
 */
MdPopoverRef.prototype._buildPanelRef = function() {
  var self = this;

  if (!this._config.panelRef) {
    var panelClass = this._config.isTooltip ? 'md-tooltip ' : 'md-popover ';
    panelClass += this._config.positionClass;
    panelClass += this._config.scope.mdPopoverClass || '';

    var panelConfig = {
      id: this._config.isTooltip ?
          'tooltip-' + this._$mdUtil.nextUid() :
          'popover-' + this._$mdUtil.nextUid(),
      attachTo: angular.element(document.body),
      propagateContainerEvents: true,
      panelClass: panelClass,
      position: this._config.panelPosition,
      zIndex: this._config.scope.mdZIndex,
      focusOnOpen: false
    };

    if (this._config.scope.mdAnimated) {
      panelConfig.animation = this._$mdPanel.newPanelAnimation()
          .openFrom(this._config.parentElement)
          .closeTo(this._config.parentElement)
          .withAnimation({
            open: 'md-show',
            close: 'md-hide'
          });
    }

    if (this._config.isTooltip) {
      panelConfig.template = this._config.element[0].textContent.trim();
      this._config.parentAriaLabel = this._config.element[0].textContent.trim();
    } else {
      var contentEl = angular.element('<md-panel></md-panel>');
      var children = this._config.element.children();
      angular.forEach(children, function(child) {
        child = angular.element(child);
        contentEl.append(child);
      });
      panelConfig.contentElement = contentEl;
    }

    this._config.panelRef = this._$mdPanel.create(panelConfig);
  }
};


/**
 * Sets the aria label of the parent element.
 * @param {string} override
 */
MdPopoverRef.prototype._addAriaLabelToParent = function(override) {
  // If building a popover, throw if there is not an aria-label present on the
  // parent element.
  if (!this._config.isTooltip && !this._config.parentElement.attr('aria-label')) {
    throw new Error('mdPopover: The popover\'s parent element is required to ' +
        'have an aria-label.');
  } else if (override || !this._config.parentElement.attr('aria-label')) {
    var rawText = override || this._config.parentAriaLabel;
    var interpolatedText = this._$interpolate(rawText)(this._config.scope);
    this._config.parentElement.attr('aria-label', interpolatedText);
  }
};


/**
 * Verifies that the `_panelRef` exists and if it does, it closes it.
 * @private
 */
MdPopoverRef.prototype._close = function() {
  this._config.panelRef && this._config.panelRef.close();
};


/*****************************************************************************
 *                  MdPopover Registry Service Implementation                *
 *****************************************************************************/


/**
 * Service that reduces the amount of listeners that are being registered by the
 * popover.
 * @param {!angular.$injector} $injector
 * @final @constructor @ngInject
 */
function MdPopoverRegistryService($injector) {
  // Injected variables.
  /** @private @const {!angular.JQLite} */
  var _$window = $injector.get('$window');

  // Private variables.
  /** @private @const {!angular.JQLite} */
  var _ngWindow = angular.element(window);

  /** @private @const {!Object} */
  var _listeners = {};

  return {
    register: register,
    deregister: deregister
  };

  /**
   * Global event handler that dispatches the registered handlers in the service.
   * @param {!Event} event Event object passed in by the browser.
   */
  function globalEventHandler(event) {
    if (_listeners[event.type]) {
      _listeners[event.type].forEach(function(currentHandler) {
        currentHandler.call(this, event);
      }, this);
    }
  }

  /**
   * Registers a new handler with the MdPopoverRegistryService.
   * @param {string} type Type of event to be registered.
   * @param {!Function} handler Event handler function.
   * @param {boolean} useCapture Whether or not to use event capturing.
   */
  function register(type, handler, useCapture) {
    var handlers = _listeners[type] = _listeners[type] || [];

    if (!handlers.length) {
      useCapture ?
          _$window.addEventListener(type, globalEventHandler, true) :
          _ngWindow.on(type, this.globalEventHandler);
    }

    if (handlers.indexOf(handler) === -1) {
      handlers.push(handler);
    }
  }

  /**
   * Removes an event handler from the MdPopoverRegistryService.
   * @param {string} type Type of event handler.
   * @param {!Function} handler The event handler itself.
   * @param {boolean} useCapture Whether or not the event handler used event
   *     capturing.
   */
  function deregister(type, handler, useCapture) {
    var handlers = _listeners[type];
    var index = handlers ? handlers.indexOf(handler) : -1;

    if (index > -1) {
      handlers.splice(index, 1);

      if (handlers.length === 0) {
        useCapture ?
            _$window.removeEventListener(type, globalEventHandler, true) :
            _ngWindow.off(type, globalEventHandler);
      }
    }
  }
}


/*****************************************************************************
 *                      MdPopover Directive Implementation                   *
 *****************************************************************************/


/**
 * A directive that handles the displaying of popovers on the screen.
 * @param {!MdPopoverService} $mdPopover
 * @final @constructor
 */
function MdPopoverDirective($mdPopover) {
  return {
    restrict: 'E',
    priority: 210, // Before `ngAria`.
    scope: {
      mdZIndex: '@?',
      mdEnabled: '=?',
      mdVisible: '=?',
      mdAutohide: '=?',
      mdPopoverClass: '@?',
      mdAnimated: '=?',
      mdOpenTrigger: '@?',
      mdCloseTrigger: '@?',
      mdOpenDelay: '@?',
      mdCloseDelay: '@?',
      mdPosition: '@?'
    },
    link: linkFunc
  };

  function linkFunc(scope, element, attrs) {
    var popoverRef = $mdPopover.create(scope, element, attrs);
  }
}
