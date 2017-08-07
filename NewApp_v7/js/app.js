var app = angular.module('newsApp', ['ngRoute']); //angularjs in-built directive

app.config(function($routeProvider) { //router for single page application 

    $routeProvider
        .when('/', { //default path
            templateUrl: 'home.html', //home.html is a view file
            controller: 'mainCtrl' //respective controller for home.html
        })
        // login
        .when('/login', {
            templateUrl: 'login.html',
            controller: 'mainCtrl'
        })
        // register
        .when('/register', {
            templateUrl: 'register.html',
            controller: 'mainCtrl'
        })
        // saved
        .when('/saved', {
            templateUrl: 'saved.html',
            controller: 'mainCtrl'
        })
});

app.controller('mainCtrl', function($scope, $http, ajaxCall) { //main controller
    setTimeout(function() { //set timeout function for slider (slider should load after the JSON response)
        $('.bxslider').bxSlider({ //options for bx slider
            minSlides: 3,
            maxSlides: 3,
            slideWidth: 360,
            slideMargin: 1,
            moveSlides: 2
        });
    }, 1000); //set time out for 1sec
    $scope.ArticlestoShow = []; //local storage scope variable
    //$scope.alreadySaved = [];
    $scope.saved = false;
    $scope.like = false;
    $scope.dislike = false;
    var savedArticle = [],
        alreadySaved = [],
        likedArticle = [],
        dislikedArticle = []; //variable to store the saved article and already saved article
    ajaxCall.getMethod().then(function(respdata) { //ajax call for fetch the date from sample.json
        $scope.myNews = respdata; //myNews holds the whole json data
        var myNews = $scope.myNews; //assigning $scope.myNews to myNews for easy accessible
        myNews.forEach(function(item, index, arr) {
            for (var i = 0; i < savedArticle.length; i++) {
                if (savedArticle[i] == item._id.$oid) {
                    alreadySaved.push(item); //variable that holds article which are saved already
                }
            }
        });
        $scope.alreadySaved = alreadySaved; //assigning alreadySaved to $scope.alreadySaved
        console.log($scope.alreadySaved)
    });
    if (localStorage.hasOwnProperty("articleId")) { //to check whether the article is saved or not in local storage
        $scope.ArticlestoShow = JSON.parse(localStorage["articleId"]); //JSON.parse will convert the string into javascript object
        savedArticle = JSON.parse(localStorage["articleId"]);
        console.log(savedArticle)
    }
    $scope.alreadyMarked = function(subset) { //to check whether the article is already saved or not
        var breaks = false
        for (var i = 0; i < savedArticle.length; i++) {
            if (subset == savedArticle[i]) {
                breaks = true;
                break;
            }
        }
        if (breaks)
            return "saved"
    }

    $scope.isSaved = function(s, event) { //function to fetch the saved article from localstorage and will be used in saved.html page
        console.log(s._id.$oid)
        var target = angular.element(event.target); //angular.element is an alias for the jQuery function and event.target property returns the element that triggered the event
        if (localStorage.hasOwnProperty("articleId")) { //checking if our browser localstorage has articleid stored or not
            savedArticle = JSON.parse(localStorage["articleId"]);
        }

        if (target.hasClass('saved') == false) //checking if the article is has saved class or not
        {
            savedArticle.push(s._id.$oid) //if not pushing it to saved article array
        } else {
            if ((savedArticle.indexOf(s._id.$oid)) > -1) {
                savedArticle.splice(savedArticle.indexOf(s._id.$oid), 1)
            }
        }
        localStorage["articleId"] = JSON.stringify(savedArticle);

        $scope.ArticlestoShow = savedArticle;
        if (localStorage.hasOwnProperty("articleId")) {
            $scope.ArticlestoShow = JSON.parse(localStorage["articleId"]);
        }
        console.log($scope.ArticlestoShow)

    }

    $scope.othersDisplay = function(subset, $event) { //function for others popup
        event.preventDefault();
        if (subset.others.length > 0) { //checking article length
            $('.display-popup').removeClass('hide'); //removing hide class
            $('.display-popup').css({
                'top': ($($event.target).offset().top + $($event.target).height()) + 10,
                'left': ($($event.target).offset().left - $('.display-popup').width() / 2)
            }); //calculating the dom position using event.target
            $('.display-popup').mouseleave(function() {
                $('.display-popup').addClass('hide');
            });
            $('.bx-controls-direction a').mouseover(function() { //hiding the popup on hovering slider buttons
                $('.display-popup').addClass('hide');
            });


            $scope.othersdetails = subset.others;
        }
        $scope.currentPage = 0; //function for pagination
        $scope.pageSize = 3;
        $scope.numberOfPages = function() {
            return Math.ceil($scope.othersdetails.length / $scope.pageSize);
        }
    }
    $scope.liked = function(subset, $event) { //function for like
        $($event.target).toggleClass('like'); //highlighting the like button
        $($event.target).next().removeClass('dislike')
        console.log(subset._id.$oid)
        var target = angular.element(event.target); //angular.element is an alias for the jQuery function and event.target property returns the element that triggered the event

        if (target.hasClass('like') == true) {
            likedArticle.push(subset._id.$oid)
            if (dislikedArticle.indexOf(subset._id.$oid) > -1) {
                dislikedArticle.splice(dislikedArticle.indexOf(subset._id.$oid), 1)

            }
        } else {
            if (likedArticle.indexOf(subset._id.$oid) > -1) {
                likedArticle.splice(likedArticle.indexOf(subset._id.$oid), 1)

            }
        }
        console.log(likedArticle)

    }
    $scope.disliked = function(subset, $event) { //function for dislike
        $($event.target).toggleClass('dislike');
        $($event.target).prev().removeClass('like');
        var target = angular.element(event.target);
        if (target.hasClass('dislike') == true) {
            dislikedArticle.push(subset._id.$oid)
            if (likedArticle.indexOf(subset._id.$oid) > -1) {
                likedArticle.splice(likedArticle.indexOf(subset._id.$oid), 1)

            }
        } else {
            if (dislikedArticle.indexOf(subset._id.$oid) > -1) {
                dislikedArticle.splice(dislikedArticle.indexOf(subset._id.$oid), 1)

            }
        }
        console.log(dislikedArticle)
    }

});

app.factory('ajaxCall', function($http) { //ajax call to fetch sample.json 
    return {
        getMethod: function() {
            var getresult = $http({ // AngularJS $http service makes a request to the server and returns a response.
                method: 'GET', //reads JSON data 
                url: 'data/verynew.json' //json data path
            }).then(function(response) { //what to do on success, and what to do on failure.
                console.log("success")
                console.log(response.data)
                return response.data;
            }, function(response) {
                console.log("failure");
            });
            return getresult;
        }
    };
});

app.filter('firstPage', function() { //filter for pagination 
    return function(input, start) {
        start = +start;
        return input.slice(start);
    }
});