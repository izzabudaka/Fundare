var app = angular.module('fas', []);

app.controller('accountsController', ['$scope', '$http', function($scope, $http) {
  $scope.accounts = accounts;
  $scope.selectedAccountIndex = null;

  $scope.selectAccount = function(account) {
    $scope.selectedAccountIndex = account;
  };

  $scope.deleteSelectedAccount = function() {
    console.log('deleting');
    $http.post('/accounts/deleteAccount', {accountId: $scope.accounts[selectedAccountIndex].id})
      .success(function(res) {
        if(res == 'success') {
          $scope.accounts.splice(index, 1);
        };
      });
    $('#confirmDeletionModal').foundation('reveal', 'close');
  };
  
  $scope.test = function() {
    $scope.accounts = null;
  };

}]);
