var express = require('express');
var router = express.Router();
var katex = require('katex');
var { parse } = require('node-html-parser');
var hljs = require('highlight.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: "GASB0's webcorner" }, (err, html) => {
    // Renderizacion de las matematicas en el documento mediante katex
    var parsedHTML = parse(html);
    var math = parsedHTML.querySelectorAll('.math');
    for (var i = 0; i < math.length; i++) {
      var equation = katex.renderToString(math[i].innerText, { throwOnError: false, displayMode: true, output: 'html' })
      math[i].innerHTML = equation;
    }

    // Highlighting del codigo de muestra mediante hljs
    parsedHTML.querySelectorAll('.code').forEach(elem => {
      var trimmedText = elem.innerText.trim().replace(/( {2,})/g, "").replace(/(&nbsp;)/g, " ");
      elem.innerHTML = hljs.default.highlightAuto(trimmedText, elem.classList.value).value;
    })

    res.send(parsedHTML.toString())
  })
});

module.exports = router;
