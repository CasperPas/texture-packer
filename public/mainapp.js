var app = angular.module('TexturePacker', ['ngMaterial']);

app.controller('AppCtrl', ['$scope',
    function($scope) {
        $scope.canvas = document.createElement('canvas');
        $scope.context = $scope.canvas.getContext('2d');
        $scope.images = [];
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');

        document.getElementById('fileInput').addEventListener('change', function(evt) {
            var files = evt.target.files;
            for (var i = 0, file; file = files[i]; i++) {
                // Only process image files.
                if (!file.type.match('image.*')) {
                    continue;
                }

                var reader = new FileReader();

                // Closure to capture the file information.
                reader.onload = (function(theFile) {
                    return function(e) {
                        var imageInfo = {
                            name: theFile.name,
                            raw: e.target.result,
                            rawCropped: null,
                            source: null,
                            cropped: null,
                            width: 0,
                            height: 0,
                            bounds: null,
                        };
                        var img = new Image();
                        img.onload = function() {
                            imageInfo.width = canvas.width = img.width;
                            imageInfo.height = canvas.height = img.height;
                            context.drawImage(img, 0, 0);
                            imageInfo.source = context.getImageData(0, 0, canvas.width, canvas.height);
                            var cords = imageInfo.bounds = Utils.getBound(imageInfo.source, img.width, img.height);
                            imageInfo.cropped = context.getImageData(cords.x, cords.y, cords.w, cords.h);
                            imageInfo.rawCropped = Utils.imageDataToSrc(imageInfo.cropped);
                            $scope.$apply(function(){
                                $scope.images.push(imageInfo);
                                // console.log($scope.images);
                            });
                            URL.revokeObjectURL(img.src);
                        };
                        img.src = e.target.result;
                    };
                })(file);

                // Read in the image file as a data URL.
                reader.readAsDataURL(file);
            }
        });
    }
]);