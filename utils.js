var Utils = {
    getBound: function(imageData, w, h) {
        function isNotTransparent(buffer32, x, y, w) {
            return buffer32[x + y * w] > 0;
        }
        
        var buffer32 = new Uint32Array(imageData.data.buffer);
        
        var x1 = w, y1 = h, x2 = 0, y2 = 0;
        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                if (isNotTransparent(buffer32, x, y, w)) {
                    x1 = (x1 > x) ? x : x1;
                    y1 = (y1 > y) ? y : y1;
                    x2 = (x2 < x) ? x : x2;
                    y2 = (y2 < y) ? y : y2;
                }
            }
        }

        return {
            x: x1,
            y: y1,
            w: x2-x1,
            h: y2-y1,
        }
    },
    
    imageDataToSrc: function(imageData) {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        canvas.width = imageData.width;
        canvas.height = imageData.height;
        context.putImageData(imageData, 0, 0);
        return canvas.toDataURL("image/png");
    }
}
