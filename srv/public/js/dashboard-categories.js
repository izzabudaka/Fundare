var app = angular.module('fas', []);

//TODO: get requirejs and ...
app.factory('CategoryActions', function($http) {
  var CategoryActions = {
    getCategories: function(callback) {
      $http.post('/dashboard/getAccounts', {})
        .success(function(res) {
          callback(null, res.categories);
      });
    }
  };

  return CategoryActions;
});


app.controller('categoriesController', ['$scope', '$http', 'CategoryActions',
  function($scope, $http, CategoryActions) {

    
  
    $scope.updateView = function() {
      CategoryActions.getCategories(function(err, categories) {
        if(!err) $scope.categories = categories;
      });
    };

  $scope.updateView();

  }
]);

