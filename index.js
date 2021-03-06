
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
 * Method plots given data and layout information into a jupyter HTML box
 * with plotly js library
 * @param {*} data 
 * @param {*} layout 
 * @returns this object for chaining
 */
var plot = (data, layout) => {

  // Retrieve certain plotly version 
  let plotlyVersion = (this.version !== undefined) ? '@'+this.version : '';

  // Generate CDN path
  let plotlyLibSource = `${CDN_PATH}${plotlyVersion}/dist/plotly.min.js`;

  // Use timestamp create a unique script identifier
  const timestamp = new Date().getTime();

  // Print html
  $$.html(`
  <div class="plotly-plot">
    <div id="notebook-plot-${timestamp}"></div>
    <script>
      function plot${timestamp}(){
        Plotly.plot('notebook-plot-${timestamp}',${JSON.stringify(data)}, ${JSON.stringify(layout)});
      }
      
      if(window.Plotly){
        plot${timestamp}();
      } else if(!window.require) {
        var head = document.head || document.getElementsByTagName(\'head\')[0];
        var s = document.createElement(\'script\');
        s.src = '${plotlyLibSource}';
        s.type = 'text/javascript';
        s.async = false;
        s.onreadystatechange = s.onload = plot${timestamp};
        head.appendChild(s);
      } else {
        require(['${plotlyLibSource}'], function(Plotly){
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
    version: undefined, // Null means latest version from CDN
    dependency,
    plot
  }
}