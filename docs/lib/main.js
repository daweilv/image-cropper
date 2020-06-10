var dragdrop = {
    drop: function (e) {
        e.preventDefault();
        var file = e.dataTransfer.files[0];
        runUpload(file);
    },
    drag: function (e) {
        e.preventDefault();
    }
}
let img = null
function runUpload(file) {
    // $('.upload_container').hide()
    // $('.content').show()
    // initPreviews(document.querySelector('.img2'))
    var reader = new FileReader()
    reader.readAsDataURL(file);
    reader.onload = function (_file) {
        console.log('runUpload onload');

        $('.upload_container').hide()
        $('.content').show()
        img = document.querySelector('#image')
        img.src = _file.target.result

        img.addEventListener('load', function (params) {
            console.log('initPreviews');
            // console.log(this.width);
            // console.log(this.height);
            // console.log(img.width);

            initPreview('#img1',img,960,420)
            initPreview('#img2',img,350,228)
            initPreview('#img3',img,100,100)
        })



    }
}

const coverImg = (ctx, img, type) => {
    const imgWidth = img.width;
    const imgHeight = img.height;
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    const imgRatio = imgHeight / imgWidth
    const canvasRatio = canvasHeight / canvasWidth
    if ((imgRatio < canvasRatio && type === 'contain') || (imgRatio > canvasRatio && type === 'cover')) {
        const h = canvasWidth * imgRatio
        ctx.drawImage(img, 0, (canvasHeight - h) / 2, canvasWidth, h)
    }
    if ((imgRatio > canvasRatio && type === 'contain') || (imgRatio < canvasRatio && type === 'cover')) {
        const w = canvasHeight / imgRatio
        ctx.drawImage(img, (canvasWidth - w) / 2, 0, w, canvasHeight)
    }
}

function initPreview(selector,img,width,height) {
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");

    coverImg(ctx, img, 'cover')

    document.querySelector(selector).src = canvas.toDataURL()

}

function initCropper() {
    const image = document.querySelector('.img');
    const cropper = new Cropper(image, {
        // aspectRatio: 16 / 9,
        preview: '.preview',
    });
    cropper.setData({ width: 100, height: 100 })
}

function handleInputOnChange(e) {
    runUpload(this.files[0])
}

window.onload = function () {
    if (!window.FileReader) {
        // Report error message if FileReader is unavilable
        var p = document.createElement('p'),
            msg = document.createTextNode('Sorry, your browser does not support FileReader.');
        p.className = 'error';
        p.appendChild(msg);
        var upload_container = document.querySelector('.upload_container');
        upload_container.innerHTML = '';
        upload_container.el.appendChild(p);
    }
};

function output() {
    var zip = new JSZip();
    zip.file("960.png", document.querySelector('#img1').src.substring('data:image/png;base64,'.length), {base64: true});
    zip.file("350.png", document.querySelector('#img2').src.substring('data:image/png;base64,'.length), {base64: true});
    zip.file("100.png", document.querySelector('#img3').src.substring('data:image/png;base64,'.length), {base64: true});
    zip.generateAsync({type:"blob"})
    .then(function(content) {
        // see FileSaver.js
        saveAs(content, "images.zip");
    });
}


window.addEventListener('DOMContentLoaded', function () {
    // var image = document.getElementById('image');
    var cropBoxData;
    var canvasData;
    var cropper;

    $('#modal').on('shown.bs.modal', function () {
      cropper = new Cropper(img, {
        autoCropArea: 0.5,
        ready: function () {
          //Should set crop box data first here
          cropper.setCropBoxData(cropBoxData).setCanvasData(canvasData);
        }
      });
    }).on('hidden.bs.modal', function () {
      cropBoxData = cropper.getCropBoxData();
      canvasData = cropper.getCanvasData();
      cropper.destroy();
    });
  });

