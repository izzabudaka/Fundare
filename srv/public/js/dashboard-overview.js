var app = angular.module('fas', []);

//TODO: get requirejs and import account.svc.js instead of this inline
app.factory('AccountActions', function($http) {
  var AccountActions = {
    getAccounts: function(callback) {
      $http.post('/accounts/getAccounts', {})
        .success(function(res) {
          callback(null, res.accounts);
      });
    },

    getStatement: function(accountId, callback) {
      $http.post('/accounts/getStatement', {accountId: accountId})
        .success(function(res) {
          callback(null, res);
        });
    },

    submitTransaction: function(accountId, params, callback) {
      console.log(params);
      $http.post('/transaction/create', {
        accountId: accountId,
        description: params.description,
        value: params.value
      }).success(function(res) {
        callback(null, res);
      }).error(function(err) {
        callback(err);
      });
    },

    deleteTransaction: function(transactionId, callback) {
      $http.post('/transaction/delete', {
        transactionId: transactionId
      }).success(function(res) {
        callback(null, res);
      }).error(function(err) {
        callback(err);
      });
    }
  };

  return AccountActions;
});


//TODO: Account select doesn't persist index properly when updating account data
//      Something to do with ng-model vs ng-option?
app.controller('overviewController', ['$scope', '$http', 'AccountActions',
  function($scope, $http, AccountActions) {
    //$scope.accounts = accounts;
    $scope.selectedAccountIndex = 0;
    $scope.statement = null;

    $scope.submitTransaction = function(params) {
      var date = params.date;
      var description = params.description;
      var value = params.value;

      var accountId = $scope.accounts[$scope.selectedAccountIndex].id;

      var newParams = {
        date: date,
        description: description,
        value: value
      };

      AccountActions.submitTransaction(accountId, newParams,
        function(err, res) {
          if(!err) $scope.updateView();
        }
      );
    };

    $scope.updateView = function() {
      AccountActions.getAccounts(function(err, accounts) {
          if(!err) $scope.accounts = accounts;
          AccountActions.getStatement($scope.accounts[$scope.selectedAccountIndex].id, function(err, statement) {
            if(!err) $scope.statement = statement;
          });
      });
    };

    $scope.updateView();
    /*AccountActions.deleteTransaction(19, function(err) {
      $scope.updateView();
    });*/
  }
]);

//TODO: make statement entries clickable (or tooltip or something) to show
//      additional options like delete, modify, etc.
app.directive('statement', function() {
  var directive = {};
  
  directive.restrict = 'E';
  

  directive.scope = {
    statementData: "=statement"
  };

  directive.template = '<h3 ng-if="statementData.length == 0">No transactions to show for this account</h3>\
  <table ng-if="statementData.length > 0">\
    <thead>\
      <tr>\
        <th width="110">Date</th>\
        <th>Description</th>\
        <th width="100" class="show-for-medium-up text-right">In (£)</th>\
        <th width="100" class="show-for-medium-up text-right">Out (£)</th>\
        <th width="120" class="text-right">Balance (£)</th>\
      </tr>\
    </thead>\
    <tbody>\
      <tr ng-repeat="transaction in statementData">\
        <td>{{transaction.date}}</td>\
        <td>{{transaction.description}}</td>\
        <td class="show-for-medium-up text-right">{{transaction.credit != 0 ? transaction.credit : ""}}</td>\
        <td class="show-for-medium-up text-right">{{transaction.debit != 0 ? transaction.debit : ""}}</td>\
        <td class="text-right"><div>{{transaction.rt}}</div><div class="show-for-small-only right">{{transaction.delta[0] != "-" ? "+" : ""}}{{transaction.delta}}</div></td>\
      </tr>\
    </tbody>\
  </table>';


  return directive;
});
