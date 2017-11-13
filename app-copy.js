var context, soundBuffer, source, analyser;
var dataArr = new Uint8Array(100)
var svgHeight = '300';
var svgWidth = '1200';
var padding = '1';

function init () {
 try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();
    loadSound('Massive-Attack-Paradise-Circus.mp3')
  }
  catch(e) {
    alert('Web Audio API is not supported in this browser');
  }
}

// repalce with fetch  later
function loadSound(url) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      // soundBuffer = buffer;
      playSound(buffer)
      analyser = createMyAnalyser(source)
      draw()
    }, function(err){console.log(err)});
  }
  request.send();
}

function playSound(buffer) {
  source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination)
  source.start(0)
}

function createMyAnalyser(source) {
  var analyser = context.createAnalyser()
  source.connect(analyser)
  // analyser.getByteFrequencyData(dataArr)

  return analyser
}


/*
 * SVG part
*/
var svg = d3.select('body').append('svg').attr({height:svgHeight, width: svgWidth})

svg.selectAll('rect')
  .data(dataArr)
  .enter()
  .append('rect')
  .attr('x', function(data, index){
    return index * (svgWidth / dataArr.length)
  })
  .attr('width', svgWidth / dataArr.length - padding)
  // .attr('height', 50)


function draw(){
  window.requestAnimationFrame(draw)
  analyser.getByteFrequencyData(dataArr)

  d3.selectAll('rect')
    .data(dataArr)
    .attr('y', function(data){
      return svgHeight - data
    })
    .attr('height', function(d){
      return d
    })
    .attr('fill', function(d){
      return '#E54F27'
    })
}

/*
 * fire it
 */
window.addEventListener('load', init, false);
