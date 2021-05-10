(() => {
  onload = () => {
    const noise_size = 256
    const canv = document.getElementById('output')
    const cont = canv.getContext('2d')

    myOnnxSession = new onnx.InferenceSession({backendHint: 'webgl'})
    myOnnxSession.loadModel('../generator.onnx')
    const model = myOnnxSession
    
    const rnorm = () => Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random())

    const generate = () => {
      console.log('called generate function')

      const noise = new Float32Array(noise_size)
      for (let i = 0; i < noise_size; i++) noise[i] = rnorm()
      const tensorNoise = new onnx.Tensor(noise, 'float32', [1, 256])

      model.run([tensorNoise]).then((output) => {
        console.log('finish running the model')
        const outputTensor = output.values().next().value
        drawGeneratedImage(generatedImage = outputTensor.data)
        console.log('result', outputTensor)
      });
    }

    document.querySelector('button').addEventListener('click', () => generate())
  }
})()