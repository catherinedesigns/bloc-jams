// var forEach = function(array) {
//     for (var i = 0; i < array.length; i++) {
//       console.log(array[i])
//     }
// };

//correct
function forEach(array, callback) {
  for (var i = 0; i < array.length; i++) {
    callback(array[i]);
  }
}
