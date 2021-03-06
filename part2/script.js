const imageUpload = document.getElementById('imageUpload')

Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('./models')  
]).then(start)

async function start() {
    const container = document.createElement('div')
    container.style.position = 'relative'
    document.body.append(container)
    const labeledFaceDescriptors = await labelImages()
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
    let image
    let canvas
    document.body.append('Loaded')
    imageUpload.addEventListener('change', async () =>{
        if (image) image.remove()
        if (canvas) canvas.remove()
        image = await faceapi.bufferToImage(imageUpload.files[0]) // get the uploaded image
        container.append(image)
        canvas = faceapi.createCanvasFromMedia(image)
        container.append(canvas)
        const displaySize = { width: image.width, height: image.height}
        faceapi.matchDimensions(canvas, displaySize)
        const detections = await faceapi.detectAllFaces(image)
            .withFaceLandmarks().withFaceDescriptors()
        // document.body.append(detections.length)
        const resizeDetections = faceapi.resizeResults(detections,displaySize)
        const results = resizeDetections.map( d => faceMatcher.findBestMatch(d.descriptor))
        results.forEach((result, i) => {
            const box = resizeDetections[i].detection.box
            const drawBox = new faceapi.draw.DrawBox(box, {label: result.toString()})
            drawBox.draw(canvas)
        })
    })
}

function labelImages() {
    const labels = [ 'chathura', 'tharushi', 'vasitha', 'pata', 'kota', 'sanjeewa']
    return Promise.all(
        labels.map(async label => {
            const descriptions = []
            for (let i = 1; i <= 2; i++){
                const img = await faceapi.fetchImage(`./label_images/${label}/${i}.jpg`)  // this label_images is images folder of training images
                console.log('img => ',img)
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                console.log('property detections =>',"hit point =>",i,label,detections)
                descriptions.push(detections.descriptor)
            }

            return new faceapi.LabeledFaceDescriptors(label, descriptions)
        })
    )
}