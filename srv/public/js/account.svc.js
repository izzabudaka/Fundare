var AccountService = function(app) {
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
};
