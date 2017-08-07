app.filter('unique', function() { //user defined filter "unique"
    return k = function(collection, keyname) {
        var output = [], keys = []; //two arrays are initialized to store the output
        angular.forEach(collection, function(item) { //function invokes the iterator function that iterates or loops through each item in an array/json
            var key = item[keyname].trim().toLowerCase(); //trim() method removes whitespace from both sides of a string and toLowerCase() method converts a string to lowercase letters.
            if (keys.indexOf(key) === -1) { //to fetch unique keys
                keys.push(key); //pushing the "keys from json" into keys array
                output.push(item);
            }
        });
        k = output; //returning output array
        return output;
    };
});