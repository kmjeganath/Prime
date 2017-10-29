
var app = angular.module('newsApp', ['ngRoute']); //angularjs in-built directive

app.config(function($routeProvider) { //router for single page application 
  
$routeProvider
    .when('/', { //default path
      templateUrl : 'home.html', //home.html is a view file
      controller : 'mainCtrl' //respective controller for home.html
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

app.controller('mainCtrl',function($scope, $http, ajaxCall){ //main controller
  setTimeout(function(){ //set timeout function for slider (slider should load after the JSON response)
  $('.bxslider').bxSlider({
    minSlides: 3,
    maxSlides: 3,
    slideWidth: 360,
    slideMargin: 1,
    moveSlides: 2 
  });
  },1000);
  $scope.ArticlestoShow  = []; //local storage scope variable
  //$scope.alreadySaved = [];
  $scope.saved = false;
  $scope.like = false;
  $scope.dislike = false;
  var savedArticle = [], alreadySaved = [], likedArticle=[], dislikedArticle = []; //variable to store the saved article and already saved article
  ajaxCall.getMethod().then(function(respdata){ //ajax call for fetch the date from sample.json
      $scope.myNews= respdata; //myNews holds the whole json data
      var myNews = $scope.myNews;
    myNews.forEach(function(item, index, arr){ 
     for(var i=0 ;i<savedArticle.length ; i++){
        if(savedArticle[i] == item._id.$oid){
          alreadySaved.push(item); //variable that holds article which are saved already
        }
      }
    });
    $scope.alreadySaved = alreadySaved;
           console.log($scope.alreadySaved)
    });
    if(localStorage.hasOwnProperty("articleId")){ //to check whether the article is saved or not in local storage
      $scope.ArticlestoShow = JSON.parse(localStorage["articleId"]); //JSON.parse will convert the string into javascript object
      savedArticle = JSON.parse(localStorage["articleId"]);
      console.log(savedArticle)
    }
    $scope.alreadyMarked = function(subset){ //to check whether the article is already saved or not
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

  $scope.isSaved = function(s, event){ //function to fetch the saved article from localstorage and will be used in saved.html page
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

$scope.othersDisplay =function(subset, $event){
  $('.display-popup').toggleClass('hide');

  console.log(subset.others)
  $scope.othersdetails = subset.others
}
$scope.closePopup = function($event){
  $($event.target).parent().toggleClass('hide');
}
$scope.liked = function(subset, $event){
    $($event.target).toggleClass('like');
    $($event.target).next().removeClass('dislike')
    console.log(subset._id.$oid)
    var target = angular.element(event.target);

    if(target.hasClass('like') ==true){
      likedArticle.push(subset._id.$oid)
       if(dislikedArticle.indexOf(subset._id.$oid) > -1){
        dislikedArticle.splice(dislikedArticle.indexOf(subset._id.$oid), 1 )

      }
    }
    else{
      if(likedArticle.indexOf(subset._id.$oid) > -1){
        likedArticle.splice(likedArticle.indexOf(subset._id.$oid), 1 )

      }
    }
    console.log(likedArticle)

}
$scope.disliked = function(subset, $event){
    $($event.target).toggleClass('dislike');
    $($event.target).prev().removeClass('like');
    var target = angular.element(event.target);
        if(target.hasClass('dislike') ==true){
      dislikedArticle.push(subset._id.$oid)
            if(likedArticle.indexOf(subset._id.$oid) > -1){
        likedArticle.splice(likedArticle.indexOf(subset._id.$oid), 1 )

      }
    }
    else{
      if(dislikedArticle.indexOf(subset._id.$oid) > -1){
        dislikedArticle.splice(dislikedArticle.indexOf(subset._id.$oid), 1 )

      }
    }
    console.log(dislikedArticle)
}

});

app.factory('ajaxCall', function($http){ //ajax call to fetch sample.json 
    return{
      getMethod: function(){
        var getresult = $http({
              method: 'GET',
                url:'data/verynew.json'
              }).then(function (response) {
              console.log("success")
              console.log(response.data)
                return response.data;
              }, function (response) {
                 console.log("failure");
              });
          return getresult;
      }
    };  
});





