require.config({
    paths: {
        'lodash': 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min'
    }
})
define(['https://cdnjs.cloudflare.com/ajax/libs/jointjs/3.6.3/joint.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/dagre/0.8.5/dagre.min.js'],
    function (joint, dagre) {
        return class JJS {
            constructor(target, nodes) {
                //append paper
                target.append('<div id="paper"></div>');

                console.log("Running...");
                // create a graph using graphlib
                var g = new dagre.graphlib.Graph();
                g.setGraph({});
                g.setDefaultEdgeLabel(function () { return {}; });

                // add nodes to the graph
                g.setNode("a", { label: "a" });
                g.setNode("b", { label: "b" });
                g.setNode("c", { label: "c" });

                // add edges to the graph
                g.setEdge("a", "b");
                g.setEdge("b", "c");

                // render the graph using dagre
                dagre.layout(g);

                // create a jointjs graph
                var graph = new joint.dia.Graph();

                // create a jointjs paper
                var paper = new joint.dia.Paper({
                    el: document.getElementById("paper"),
                    width: 200,
                    height: 200,
                    model: graph,
                    gridSize: 5
                });

                // add the nodes and edges from dagre to jointjs
                g.nodes().forEach(function (v) {
                    var node = g.node(v);
                    var rect = new joint.shapes.basic.Rect({
                        position: { x: node.x, y: node.y },
                        size: { width: node.width, height: node.height },
                        attrs: { rect: { fill: "white" }, text: { text: node.label, fill: "black" } }
                    });
                    rect.addTo(graph);
                });

                g.edges().forEach(function (e) {
                    var edge = g.edge(e);
                    var link = new joint.dia.Link({
                        source: { id: edge.v },
                        target: { id: edge.w },
                        attrs: { ".marker-target": { d: "M 10 0 L 0 5 L 10 10 z" } }
                    });
                    link.addTo(graph);
                });

                paper.model = g;
            }
        }
    });