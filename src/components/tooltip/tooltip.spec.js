describe('MdTooltip Component', function() {
  var $compile, $rootScope, $material, $mdPopover;
  var element;

  var injectLocals = function($injector) {
    $compile = $injector.get('$compile');
    $rootScope = $injector.get('$rootScope');
    $material = $injector.get('$material');
    $mdPopover = $injector.get('$mdPopover');
  };

  beforeEach(function() {
    module(
      'material.components.popover',
      'material.components.panel'
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

  it('should create itself with the $mdPopover', function() {
    spyOn($mdPopover, 'create');

    buildTooltip(
      '<md-button>' +
        'Hello' +
        '<md-tooltip>Tooltip</md-tooltip>' +
      '</md-button>'
    );

    expect($mdPopover.create).toHaveBeenCalled();
  });

  // ******************************************************
  // Internal Utility methods
  // ******************************************************

  function buildTooltip(markup) {
    element = $compile(markup)($rootScope);
    $rootScope.testModel = {};

    $rootScope.$apply();
    $material.flushOutstandingAnimations();

    return element;
  }
});
