require.config({
    paths: {
        'lodash': 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min'
    }
})
define(['https://cdnjs.cloudflare.com/ajax/libs/jointjs/3.6.3/joint.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/dagre/0.8.5/dagre.min.js',
    'css!https://cdnjs.cloudflare.com/ajax/libs/jointjs/3.6.2/joint.css'],
    function (joint, dagre, jointcss) {
        return class JJS {
            constructor(target, nodes, core) {
                console.log("Running...");

                console.log(nodes);

                var namespace = joint.shapes;

                var graph = new joint.dia.Graph({}, { cellNamespace: namespace });

                var paper = new joint.dia.Paper({
                    el: target,
                    model: graph,
                    width: target.width,
                    height: target.height,
                    gridSize: 1,
                    cellViewNamespace: namespace
                });

                var rect = new joint.shapes.standard.Rectangle();
                rect.position(100, 30);
                rect.resize(100, 40);
                rect.attr({
                    body: {
                        fill: 'blue'
                    },
                    label: {
                        text: 'Hello',
                        fill: 'white'
                    }
                });
                rect.addTo(graph);

                var rect2 = rect.clone();
                rect2.translate(300, 0);
                rect2.attr('label/text', 'World!');
                rect2.addTo(graph);

                var link = new joint.shapes.standard.Link();
                link.source(rect);
                link.target(rect2);
                link.addTo(graph);
            }
        }
    });