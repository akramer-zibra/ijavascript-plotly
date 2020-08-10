
// Check preconditions
if($$ === undefined) {
  throw new Error('This package needs to be installed in combination with jupyter notebook server and ijavascript npm package')
} 

/* Internal variables */
var CDN_PATH = '//cdn.jsdelivr.net/npm/plotly.js';

/**
 * Methods can fix plotly dependency to a certain version
 * @param {*} version 
 * @returns this object for chaining
 */
var dependency = (version) => {
  this.version = version;
  return this;
}

/**
 * Method prints given data and layout information into a jupyter HTML box
 * @param {*} data 
 * @param {*} layout 
 * @returns this object for chaining
 */
var plotly = (data, layout) => {

  // Retrieve certain plotly version 
  let plotlyVersion = (this.version !== null) ? '@'+this.version : '';

  // Generate CDN path
  let plotlyCdnSource = `${CDN_PATH}${$plotlyVersion}/lib/index.min.js`;


  // Print 
  $$.html(`
  <div class="plotly-plot">
    <div id="notebook-plot-${timestamp}"></div>
    <script>
      function plot${timestamp}(){
        Plotly.plot('notebook-plot-${timestamp}',${JSON.stringify(data)}, ${JSON.stringify(layout)});
      } if(window.Plotly){ plot${timestamp}(); } else if(!window.require) {
        var head = document.head || document.getElementsByTagName(\'head\')[0];
        var s = document.createElement(\'script\');
        s.src = '${plotlyCdnSource}';
        s.type = 'text/javascript';
        s.async = false;
        s.onreadystatechange = s.onload = plot${timestamp};
        head.appendChild(s);
      }else{
        require(['${plotlyCdnSource}'], function(Plotly){
          window.Plotly = Plotly;
          plot${timestamp}();
        });
      }
    </script>
  </div>
  `);

  return this;
}

/**
 * Exports a factory method for this jupyter integration module
 */
module.exports = () => {
  return {
    version: null,
    dependency,
    plotly
  }
}