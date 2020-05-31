const video = document.getElementById('video')

Promise.all([
    faceapi.nets.tnyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.LoadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.LoadFromUri('/models'),
    faceapi.nets.faceExpressionNet.LoadFromUri('/models')
]).then(startVideo)

function startVideo() {
    navigator.getUserMedia(
        {video: {}},
        stream => video.srcObject = stream,
        err => console.log(err)
    )
}
video.addEventListener('play', ()=> {
    console.log('hellooo');
})