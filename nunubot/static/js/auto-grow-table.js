var app = angular.module('investment', []);

app.controller("records", function ($scope) {



  function createEmptyRow($index) {
    return {
        trans_number: $index,
        description: "",
        year: null,
        month: null,
        day: null,
        activity: "",
        quantity: null,
        amount: null
    };
  }
  
  var rows = [];
  rows.push(createEmptyRow(0));

  $scope.change = function ($index) {
    var row = rows[$index];
    if (row.description === "") {
      rows.splice($index, 1);
    }
    else if ($index == $scope.rows.length - 1) {
      rows.push(createEmptyRow($index + 1));
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

  $scope.setCurrentRow = function (rowNum) {
    $scope.currentRow = rowNum;
  };

  $scope.submit = function () {
    var sortedSet = rows.slice(0, rows.length-1);
    sortedSet.sort(sortMultiple("description", "trans_number"));
    transition();
  };

  $scope.export = function () {
    alert("black");
  };

  $scope.back = function () {
    var inputTab = $("#inputTab");
    var outputTab = $("#outputTab");
    outputTab.hide();
    inputTab.show();
    $('.progress .progress-bar').attr('aria-valuetransitiongoal', 0).progressbar();
  };

  function transition()
  {
    var inputTab = $("#inputTab");
    var progressTab = $("#progressTab");
    var outputTab = $("#outputTab");
    inputTab.hide();
    progressTab.show();
    $('.progress .progress-bar').attr('aria-valuetransitiongoal', 100).progressbar({display_text: 'fill'});
    progressTab.delay(1000).fadeOut();
    outputTab.delay(2000).fadeIn();
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



function sortFunction(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var aString = a[property].toUpperCase()
        var bString = b[property].toUpperCase()
        var result = (aString < bString) ? -1 : (aString > bString) ? 1 : 0;
        return result * sortOrder;
    }
}

function sortMultiple() {
    var props = arguments;
    return function (obj1, obj2) {
        var i = 0, result = 0, numberOfProperties = props.length;
        /* try getting a different result from 0 (equal)
         * as long as we have extra properties to compare
         */
        while(result === 0 && i < numberOfProperties) {
            result = sortFunction(props[i])(obj1, obj2);
            i++;
        }
        return result;
    }
}