// ******************************************************
// MdPopover Component
// ******************************************************

describe('MdPopover Component', function() {
  var $compile, $rootScope, $material, $document, $timeout, $mdPopover,
      $mdPopoverRegistry;
  var element;

  var injectLocals = function($injector) {
    $compile = $injector.get('$compile');
    $rootScope = $injector.get('$rootScope');
    $material = $injector.get('$material');
    $document = $injector.get('$document');
    $timeout = $injector.get('$timeout');
    $window = $injector.get('$window');
    $mdPopover = $injector.get('$mdPopover');
    $mdPopoverRegistry = $injector.get('$mdPopoverRegistry');
  };

  beforeEach(function() {
    module(
      'material.components.popover',
      'material.components.button'
    );

    inject(injectLocals);
  });

  afterEach(function() {
    // Make sure to remove/cleanup after each test.
    element.remove();
    var scope = element && element.scope();
    scope && scope.$destroy;
    element = undefined;
  });

  it('should open and close when mdVisible is set', function() {
    expect(findPopover().length).toBe(0);

    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-popover md-visible="testModel.isVisible">' +
          '<md-popover-title>Title</md-popover-title>' +
          '<md-popover-content>Content</md-popover-content>' +
        '</md-popover>' +
      '</md-button>'
    );

    showPopover(true);

    expect(findPopover().length).toBe(1);
    expect(findPopover().hasClass('md-show')).toBe(true);

    showPopover(false);

    expect(findPopover().length).toBe(1);
    expect(findPopover().hasClass('md-hide')).toBe(true);
  });

  it('should toggle visibility on the next touch when no custom triggers are ' +
      'present', function() {
    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-tooltip md-visible="testModel.isVisible">Tooltip</md-tooltip>' +
      '</md-button>'
    );

    triggerEvent('touchstart');
    expect($rootScope.testModel.isVisible).toBe(true);

    triggerEvent('touchend');
    $document.triggerHandler('touchend');
    $timeout.flush();
    expect($rootScope.testModel.isVisible).toBeFalsy();
  });

  it('should support custom zIndexes', function() {
    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-popover md-z-index="200" md-visible="true">' +
          '<md-popover-title>Title</md-popover-title>' +
          '<md-popover-content>Content</md-popover-content>' +
        '</md-popover>' +
      '</md-button>'
    );

    expect(findPopover().css('z-index')).toEqual(200);
  });

  it('should default zIndex if a custom is not present', function() {
    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-popover md-visible="true">' +
          '<md-popover-title>Title</md-popover-title>' +
          '<md-popover-content>Content</md-popover-content>' +
        '</md-popover>' +
      '</md-button>'
    );

    expect(findPopover().css('z-index')).toEqual(100);
  });

  it('should support dynamic positions', function() {
    expect(function() {
      buildPopover(
        '<md-button>' +
          'Hello' +
          '<md-popover md-position="{{position}}">' +
            '<md-popover-title>Title</md-popover-title>' +
            '<md-popover-content>Content</md-popover-content>' +
          '</md-popover>' +
        '</md-button>'
      );
    }).not.toThrow();
  });

  it('should default position to "top" if it is a popover and a custom ' +
      'position is not present', function() {
    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-popover md-visible="true">' +
          '<md-popover-title>Title</md-popover-title>' +
          '<md-popover-content>Content</md-popover-content>' +
        '</md-popover>' +
      '</md-button>'
    );

    expect(findPopover()).toHaveClass('md-position-top');
  });

  it('should default position to "bottom" if it is a tooltip and a custom ' +
      'position is not present', function() {
    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-tooltip md-visible="true">Tooltip</md-tooltip>' +
      '</md-button>'
    );

    expect(findPopover()).toHaveClass('md-position-bottom');
  });

  it('should support custom classes that are added to the popover',
        function() {
      buildPopover(
        '<md-button>' +
          'Hello' +
          '<md-popover md-popover-class="testClass" md-visible="true">' +
            '<md-popover-title>Title</md-popover-title>' +
            '<md-popover-content>Content</md-popover-content>' +
          '</md-popover>' +
        '</md-button>'
      );

      expect(findPopover()).toHaveClass('testClass');
    });

  it('should support custom triggers in mdOpenTrigger', function() {
    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-popover ' +
          'md-visible="testModel.isVisible" ' +
          'md-open-trigger="click">' +
          '<md-popover-title>Title</md-popover-title>' +
          '<md-popover-content>Content</md-popover-content>' +
        '</md-popover>' +
      '</md-button>'
    );

    triggerEvent('click');
    expect($rootScope.testModel.isVisible).toBe(true);
  });

  it('should default mdOpenTrigger to "mouseenter touchstart focus" when ' +
      'no custom mdOpenTrigger is present', function() {
    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-popover md-visible="testModel.isVisible">' +
          '<md-popover-title>Title</md-popover-title>' +
          '<md-popover-content>Content</md-popover-content>' +
        '</md-popover>' +
      '</md-button>'
    );

    triggerEvent('mouseenter');
    expect($rootScope.testModel.isVisible).toBe(true);

    showPopover(false);
    expect($rootScope.testModel.isVisible).toBeFalsy();

    triggerEvent('touchstart');
    expect($rootScope.testModel.isVisible).toBe(true);

    showPopover(false);
    expect($rootScope.testModel.isVisible).toBeFalsy();

    triggerEvent('focus');
    expect($rootScope.testModel.isVisible).toBe(true);

    showPopover(false);
    expect($rootScope.testModel.isVisible).toBeFalsy();
  });

  it('should support custom triggers in mdCloseTrigger', function() {
    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-popover ' +
          'md-visible="testModel.isVisible" ' +
          'md-close-trigger="click">' +
          '<md-popover-title>Title</md-popover-title>' +
          '<md-popover-content>Content</md-popover-content>' +
        '</md-popover>' +
      '</md-button>'
    );

    showPopover(true);
    expect($rootScope.testModel.isVisible).toBe(true);

    triggerEvent('click');
    expect($rootScope.testModel.isVisible).toBeFalsy();
  });

  it('should default mdCloseTrigger to "mouseleave touchcancel blur" when ' +
      'no custom mdCloseTrigger is present', function() {
    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-popover md-visible="testModel.isVisible">' +
          '<md-popover-title>Title</md-popover-title>' +
          '<md-popover-content>Content</md-popover-content>' +
        '</md-popover>' +
      '</md-button>'
    );

    showPopover(true);
    expect($rootScope.testModel.isVisible).toBe(true);

    triggerEvent('mouseleave');
    expect($rootScope.testModel.isVisible).toBeFalsy();

    showPopover(true);
    expect($rootScope.testModel.isVisible).toBe(true);

    triggerEvent('touchcancel');
    expect($rootScope.testModel.isVisible).toBeFalsy();

    showPopover(true);
    expect($rootScope.testModel.isVisible).toBe(true);

    triggerEvent('blur');
    expect($rootScope.testModel.isVisible).toBeFalsy();
  });

  it('should not be visible when the window is refocused', function() {
    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-tooltip md-visible="testModel.isVisible">Tooltip</md-tooltip>' +
      '</md-button>'
    );

    // Append element to DOM so it can be set as activeElement.
    $document[0].body.appendChild(element[0]);
    element[0].focus();
    triggerEvent('focus,mousedown');
    expect(document.activeElement).toBe(element[0]);

    triggerEvent('mouseleave');

    // Simulate tabbing away.
    angular.element($window).triggerHandler('blur');

    // Simulate focus event that occurs when tabbing back to the window.
    triggerEvent('focus');
    expect($rootScope.testModel.isVisible).toBe(false);

    // CLean up document.body.
    $document[0].body.removeChild(element[0]);
  });

  it('should default mdOpenDelay to 0ms when a custom delay is not present',
      function() {
    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-popover md-visible="testModel.isVisible">' +
          '<md-popover-title>Title</md-popover-title>' +
          '<md-popover-content>Content</md-popover-content>' +
        '</md-popover>' +
      '</md-button>'
    );

    triggerEvent('focus', true);
    expect($rootScope.testModel.isVisible).toBe(true);
  });

  it('should open popover after mdOpenDelay ms', function() {
    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-popover md-visible="testModel.isVisible" md-open-delay="99">' +
          '<md-popover-title>Title</md-popover-title>' +
          '<md-popover-content>Content</md-popover-content>' +
        '</md-popover>' +
      '</md-button>'
    );

    triggerEvent('focus', true);
    expect($rootScope.testModel.isVisible).toBeFalsy();

    // Wait 1ms below delay, nothing should happen.
    $timeout.flush(98);
    expect($rootScope.testModel.isVisible).toBeFalsy();

    // Total 99ms delay.
    $timeout.flush(1);
    expect($rootScope.testModel.isVisible).toBe(true);
  });

  it('should default mdCloseDelay to 0ms when a custom delay is not present',
      function() {
    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-popover md-visible="testModel.isVisible">' +
          '<md-popover-title>Title</md-popover-title>' +
          '<md-popover-content>Content</md-popover-content>' +
        '</md-popover>' +
      '</md-button>'
    );

    showPopover();

    triggerEvent('blur', true);
    expect($rootScope.testModel.isVisible).toBeFalsy();
  });

  it('should close popover after mdCloseDelay ms', function() {
    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-popover md-visible="testModel.isVisible" md-close-delay="99">' +
          '<md-popover-title>Title</md-popover-title>' +
          '<md-popover-content>Content</md-popover-content>' +
        '</md-popover>' +
      '</md-button>'
    );

    showPopover();

    triggerEvent('blur', true);
    expect($rootScope.testModel.isVisible).toBe(true);

    // Wait 1ms below delay, nothing should happen.
    $timeout.flush(98);
    expect($rootScope.testModel.isVisible).toBe(true);

    // Total 99ms delay.
    $timeout.flush(1);
    expect($rootScope.testModel.isVisible).toBeFalsy();
  });

  it('should cancel popover when a default mdCloseTrigger occurs before the ' +
      'mdOpenDelay', function() {
    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-popover md-visible="testModel.isVisible" md-open-delay="99">' +
          '<md-popover-title>Title</md-popover-title>' +
          '<md-popover-content>Content</md-popover-content>' +
        '</md-popover>' +
      '</md-button>'
    );

    triggerEvent('mouseenter', true);
    expect($rootScope.testModel.isVisible).toBeFalsy();

    triggerEvent('mouseleave', true);
    expect($rootScope.testModel.isVisible).toBeFalsy();

    // Total 99 === mdOpenDelay.
    $timeout.flush(99);
    expect($rootScope.testModel.isVisible).toBeFalsy();
  });

  it('should preserve parent text when building a tooltip', function() {
    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-tooltip md-visible="testModel.isVisible">Tooltip</md-tooltip>' +
      '</md-button>'
    );

    expect(element.text()).toBe('Hello');
  });

  it('should preserve parent text when building a popover', function() {
    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-popover md-visible="testModel.isVisible">' +
          '<md-popover-title>Title</md-popover-title>' +
          '<md-popover-content>Content</md-popover-content>' +
        '</md-popover>' +
      '</md-button>'
    );

    expect(element.text()).toBe('Hello');
  });

  it('should label the parent if building a tooltip and a label is not present',
      function() {
    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-tooltip md-visible="true">Tooltip</md-tooltip>' +
      '</md-button>'
    );

    expect(element.attr('aria-label')).toEqual('Tooltip');
  });

  it('should interpolate the label on the parent of a tooltip', function() {
    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-tooltip md-visible="true">{{ "tooltip" | uppercase }}</md-tooltip>' +
      '</md-button>'
    );

    expect(element.attr('aria-label')).toBe('TOOLTIP');
  });

  it('should update the interpolated label on the parent of a tooltip when ' +
      'the interpolated value changes', function() {
    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-tooltip md-visible="true">{{ testModel.ariaText }}</md-tooltip>' +
      '</md-button>'
    );

    $rootScope.$apply(function() {
      $rootScope.testModel.ariaText = 'test 1';
    });

    expect(element.attr('aria-label')).toBe('test 1');

    $rootScope.$apply(function() {
      $rootScope.testModel.ariaText = 'test 2';
    });

    expect(element.attr('aria-label')).toBe('test 2');
  });

  it('should throw if building a popover and a label is not present on the ' +
      'parent', function() {
    expect(function() {
      buildPopover(
        '<md-button>' +
          'Hello' +
          '<md-popover md-visible="true">' +
            '<md-popover-title>Title</md-popover-title>' +
            '<md-popover-content>Content</md-popover-content>' +
          '</md-popover>' +
        '</md-button>'
      );
    }).toThrow();
  });

  it('should not set parent to elements with no pointer events', function() {
    spyOn($window, 'getComputedStyle').and.callFake(function(el) {
      return { 'pointer-events': el ? 'none' : '' };
    });

    buildPopover(
      '<outer>' +
        '<inner>' +
          '<md-tooltip md-visible="testModel.isVisible">Tooltip</md-tooltip>' +
        '</inner>' +
      '</outer>'
    );

    triggerEvent('focus', true);
    expect($rootScope.testModel.isVisible).toBeUndefined();
  });

  it('should throw when building a tooltip and the tooltip text is empty',
      function() {
    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-tooltip md-visible="testModel.isVisible">' +
          '{{ tooltip }}' +
        '</md-tooltip>' +
      '</md-button>'
    );

    expect(function() {
      showPopover(true);
    }).toThrow();
  });

  it('should clean up if the parent scope was destroyed', function() {
    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-popover md-visible="true">' +
          '<md-popover-title>Title</md-popover-title' +
          '<md-popover-content>Content</md-popover-content>' +
        '</md-popover>' +
      '</md-button>'
    );

    var popover = findPopover();

    expect(popover.length).toBe(1);
    expect(popover.scope()).toBeTruthy();

    element.scope().$destroy();
    expect(popover.scope()).toBeUndefined();
    expect(findPopover().length).toBe(0);
  });

  it('should remove the popover when its own scope is destroyed', function() {
    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-tooltip md-visible="true">Tooltip</md-tooltip>' +
      '</md-button>'
    );

    var popover = findPopover();
    expect(popover.length).toBe(1);

    popover.scope().$destroy();
    expect(findPopover().length).toBe(0);
  });

  it('should register itself with the $mdPopoverRegistry', function() {
    spyOn($mdPopoverRegistry, 'register');

    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-tooltip>Tooltip</md-tooltip>' +
      '</md-button>'
    );

    expect($mdPopoverRegistry.register).toHaveBeenCalled();
  });

  it('should deregister itself with the $mdPopoverRegistry when the parent ' +
      'scope is destroyed', function() {
    spyOn($mdPopoverRegistry, 'deregister');

    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-popover md-visible="true">' +
          '<md-popover-title>Title</md-popover-title>' +
          '<md-popover-content>Content</md-popover-content>' +
        '</md-popover>' +
      '</md-button>'
    );

    element.scope().$destroy();
    expect($mdPopoverRegistry.deregister).toHaveBeenCalled();
  });

  it('should not re-appear if it was outside the DOM when the parent was ' +
      'removed', function() {
    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-tooltip md-visible="testModel.isVisible">Tooltip</md-tooltip>' +
      '</md-button>'
    );

    showPopover(false);
    expect(findPopover().length).toBe(0);

    element.remove();
    showTooltip(true);
    expect(findPopover().length).toBe(0);
  });

  it('should unbind the parent listeners when it gets destroyed', function() {
    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-tooltip md-visible="testModel.isVisible">Tooltip</md-tooltip>' +
      '</md-button>'
    );

    triggerEvent('focus');
    expect($rootScope.testModel.isVisible).toBe(true);

    element.remove();
    triggerEvent('blur mouseleave touchend touchcancel');
    expect($rootScope.testModel.isVisible).toBe(true);
  });

  // ******************************************************
  // Internal Utility methods
  // ******************************************************

  function buildPopover(markup) {
    element = $compile(markup)($rootScope);
    $rootScope.testModel = {};

    $rootScope.$apply();
    $material.flushOutstandingAnimations();

    return element;
  }

  function showPopover(isVisible) {
    if (angular.isUndefined(isVisible)) {
      isVisible = true;
    }

    $rootScope.testModel.isVisible = !!isVisible;
    $rootScope.$apply();
    $material.flushOutstandingAnimations();
  }

  function findPopover() {
    return angular.element(document.querySelector('.md-panel'));
  }

  function triggerEvent(eventType, skipFlush) {
    angular.forEach(eventType.split(','), function(name) {
      element.triggerHandler(name);
    });
    !skipFlush && $timeout.flush();
  }
});


// ******************************************************
// MdPopoverRegistry
// ******************************************************

describe('MdPopoverRegistry Service', function() {
  var popoverRegistry, ngWindow;

  var injectLocals = function($mdPopoverRegistry, $window) {
    popoverRegistry = $mdPopoverRegistry;
    ngWindow = angular.element($window);
  };

  beforeEach(function() {
    module('material.components.popover');

    inject(injectLocals);
  });

  it('should allow for registering event handlers on the window', function() {
    var obj = {
      callback: function() {}
    };

    spyOn(obj, 'callback');

    popoverRegistry.register('resize', obj.callback);
    ngWindow.triggerHandler('resize');

    // Check that the callback was triggered.
    expect(obj.callback).toHaveBeenCalled();

    // Check that the event object was passed.
    expect(obj.callback.calls.mostRecent().args[0]).toBeTruthy();
  });

  it('should allow for deregistering of the callbacks', function() {
    var obj = {
      callback: function() {}
    };

    spyOn(obj, 'callback');

    popoverRegistry.register('resize', obj.callback);
    ngWindow.triggerHandler('resize');
    expect(obj.callback).toHaveBeenCalledTimes(1);

    popoverRegistry.deregister('resize', obj.callback);
    ngWindow.triggerHandler('resize');
    expect(obj.callback).toHaveBeenCalledTimes(1);
  });
});
