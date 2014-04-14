var app = angular.module('AutoGrowTable', []);

app.controller("Records", function ($scope) {
  
  function createDefault() {
    return { name: "", age: 0 };
  }
  
  var rows = [];
  rows.push(createDefault());

  $scope.change = function ($index) {
    var row = rows[$index];
    
    if (row.name === "") {
      rows.splice($index, 1);
    }
    else if ($index == $scope.rows.length - 1) {
      rows.push(createDefault());
    }
  };
  
  $scope.move = function ($index, $event) {
    switch ($event.keyCode) {
      case 38:
        if ($index > 0) {
          if ($event.ctrlKey && $index < rows.length - 1) {
            // Ctrl+Up
            var prev = rows.splice($index - 1, 1);
            rows.splice($index, 0, prev[0]);
          }
          // Up
          $scope.setCurrentRow($index - 1);
        }
        break;
        
      case 40:
        if ($event.ctrlKey && $index < rows.length - 2) {
          // Ctrl+Down
          var next = rows.splice($index + 1, 1);
          rows.splice($index, 0, next[0]);
        }
        // Down
        if ($index < rows.length - 1) {
          $scope.setCurrentRow($index + 1);
        }
        break;
    }
  };
  
  $scope.clearAll = function () {
    rows.splice(0, rows.length - 1);
  };
  
  $scope.requireName = function ($index) {
    return { display: rows[$index].name === "" ? "none" : "" };
  };
  
  $scope.setCurrentRow = function (rowNum) {
    $scope.currentRow = rowNum;
  }
  
  $scope.rows = rows;
  $scope.currentRow = null;
});

// custom directive to support ng-focus=""
app.directive('ngFocus', ['$parse', function($parse) {
  return function(scope, element, attr) {
    var fn = $parse(attr['ngFocus']);
    element.bind('focus', function(event) {
        scope.$apply(function() {
        fn(scope, {$event:event});
      });
    });
  };
}]);

// custom directive to support ng-blur=""
app.directive('ngBlur', ['$parse', function($parse) {
  return function(scope, element, attr) {
    var fn = $parse(attr['ngBlur']);
    element.bind('blur', function(event) {
      scope.$apply(function() {
        fn(scope, {$event:event});
      });
    });
  };
}]);

// custom directive to support focus=""
app.directive('focus', function () {
  return function (scope, element, attrs) {
    attrs.$observe('focus', function (newValue) {
      newValue === 'true' && element[0].focus();
    });
  }
});