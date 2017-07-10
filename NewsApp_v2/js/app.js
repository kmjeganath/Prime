
var app = angular.module('newsApp', ['ngRoute']);

app.config(function($routeProvider) {
  
  $routeProvider
    .when('/', {
      templateUrl : 'home.html',
      controller : 'mainCtrl'
    })
    // login
    .when('/login', {
      templateUrl : 'login.html',
      controller : 'mainCtrl'
    })
    // register
    .when('/register', {
      templateUrl : 'register.html',
      controller : 'mainCtrl'
    })
    // saved
    .when('/saved', {
      templateUrl : 'saved.html',
      controller : 'mainCtrl'
    })
    
});

app.controller('mainCtrl',function($scope, $http, ajaxCall){
  setTimeout(function(){
  $('.bxslider').bxSlider({
    minSlides: 3,
    maxSlides: 3,
    slideWidth: 360,
            slideMargin: 1,
            moveSlides: 2 
  });
  },1000);
  $scope.ArticlestoShow  = [];
  //$scope.alreadySaved = [];
  $scope.saved = false;
  $scope.like = false;
  $scope.dislike = false;
  var savedArticle = [], alreadySaved = [];
  ajaxCall.getMethod().then(function(respdata){
      $scope.myNews= respdata;
      var myNews = $scope.myNews;
    myNews.forEach(function(item, index, arr){
     for(var i=0 ;i<savedArticle.length ; i++){
        if(savedArticle[i] == item._id.$oid){
          // console.log(item)
          alreadySaved.push(item)
           // console.log(alreadySaved)

        }
      }

    });
    $scope.alreadySaved = alreadySaved
           console.log($scope.alreadySaved)

    });
    if(localStorage.hasOwnProperty("articleId")){
      $scope.ArticlestoShow = JSON.parse(localStorage["articleId"]);
      savedArticle = JSON.parse(localStorage["articleId"]);

      console.log(savedArticle)
    }
    $scope.alreadyMarked = function(subset){
      var breaks = false
      //var subset = subsets._id.$oid
     for(var i=0 ;i<savedArticle.length ; i++){
      if(subset == savedArticle[i]){
        breaks = true;
        break;
      }
     }
      if(breaks)
        return "saved"
    }

  $scope.isSaved = function(s, event){
    console.log(s._id.$oid)
    var target = angular.element(event.target);
        if(localStorage.hasOwnProperty("articleId")){
      savedArticle = JSON.parse(localStorage["articleId"]);
    }

    if(target.hasClass('saved') == false)
    {
      savedArticle.push(s._id.$oid)
    }
    else{
      if((savedArticle.indexOf(s._id.$oid)) > -1 ){
        savedArticle.splice(savedArticle.indexOf(s._id.$oid), 1 )
      }
    }
        localStorage["articleId"]=JSON.stringify(savedArticle);

    $scope.ArticlestoShow = savedArticle;
      if(localStorage.hasOwnProperty("articleId")){
      $scope.ArticlestoShow=JSON.parse(localStorage["articleId"]);
    }
    console.log($scope.ArticlestoShow)

  }

$scope.liked = function($event){
    $($event.target).toggleClass('like');
    $($event.target).next().removeClass('dislike')
}
$scope.disliked = function($event){
    $($event.target).toggleClass('dislike');
    $($event.target).prev().removeClass('like')
}

});

app.factory('ajaxCall', function($http){
    return{
      getMethod: function(){
        var getresult = $http({
              method: 'GET',
                url:'data/sample.json'
              }).then(function (response) {
              console.log("success")
                return response.data;
              }, function (response) {
                 console.log("failure");
              });
          return getresult;
      }
    };  
});





