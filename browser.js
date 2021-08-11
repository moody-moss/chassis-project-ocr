window.addEventListener('load', function () {

    const codeReader = new ZXing.BrowserDatamatrixCodeReader()
    console.log('ZXing code reader initialized');
    const resultSN = document.getElementById('result')
    const img = document.getElementById('img')
    const decodeFun = (e) => {

        // DECODE DATA MATRIX
        codeReader.decodeFromImage(img)
            .then(result => {
                console.log(result)
                resultSN.textContent = result.text
                //console.log(`Started decode for image from ${img.src}`)
            })
            .catch(err => {
                console.error(err);
                resultSN.textContent = err
            });


    };

    //document.getElementById('button').addEventListener('click', decodeFun)
    //window.onload(decodeFun)
    decodeFun()

})
