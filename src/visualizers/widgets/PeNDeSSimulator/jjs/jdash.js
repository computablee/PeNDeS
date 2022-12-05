require.config({
    paths: {
        'lodash': 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min'
    }
})
define(['https://cdnjs.cloudflare.com/ajax/libs/jointjs/3.6.3/joint.min.js',
    'css!https://cdnjs.cloudflare.com/ajax/libs/jointjs/3.6.2/joint.css'],
    function (joint, _) {
        return class JJS {
            extractGraph(nodes, core) {
                let oldcore = core;
                core = core.getNode(Object.keys(nodes)[0])._state.core;

                let oldnodes = nodes;
                nodes = oldcore.getNode(Object.keys(nodes)[0])._state.nodes;

                let objects = {};

                for (var node in oldnodes) {
                    let actnode = nodes[node].node;
                    let meta = core.getMetaType(actnode);
                    let type = meta ? core.getAttribute(meta, 'name') : null;

                    if (type == 'Place') {
                        objects[core.getPath(actnode)] = { type, marking: core.getAttribute(actnode, 'Marking'), x: oldnodes[node].pos.x, y: oldnodes[node].pos.y };
                    }
                    else if (type == 'Transition') {
                        objects[core.getPath(actnode)] = { type, x: oldnodes[node].pos.x, y: oldnodes[node].pos.y };
                    }
                }

                for (var node in oldnodes) {
                    let actnode = nodes[node].node;
                    let meta = core.getMetaType(actnode);
                    let type = meta ? core.getAttribute(meta, 'name') : null;

                    if (type == 'Inplace' || type == 'Outplace') {
                        objects[core.getPath(actnode)] = {
                            type: 'arc',
                            src: core.getPointerPath(actnode, 'src'),
                            dst: core.getPointerPath(actnode, 'dst'),
                            x: oldnodes[node].pos.x, y: oldnodes[node].pos.y
                        };
                    }
                }
                return objects;
            }

            draw(target) {
                let objects = this.objects
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

                for (var node in objects) {
                    let obj = objects[node];
                    if (obj.type == 'Place') {
                        console.log(obj);
                        var circ = new joint.shapes.standard.Circle();
                        circ.position(obj.x, obj.y);
                        circ.resize(60, 60);
                        circ.attr({
                            body: {
                                fill: 'white'
                            },
                            label: {
                                text: obj.marking.toString(),
                                fill: 'black'
                            }
                        });

                        circ.addTo(graph);
                        objects[node].shape = circ;
                    }
                    else if (obj.type == 'Transition') {
                        var rect = new joint.shapes.standard.Rectangle();
                        rect.position(obj.x, obj.y);
                        rect.resize(40, 120);
                        rect.attr({
                            body: {
                                fill: 'white'
                            }
                        });

                        rect.addTo(graph);
                        objects[node].shape = rect;
                    }
                }

                for (var node in objects) {
                    let obj = objects[node];
                    if (obj.type == 'arc') {
                        var link = new joint.shapes.standard.Link();
                        let [src, dst] = [obj.src, obj.dst];
                        if (objects[src] && objects[dst]) {
                            link.source(objects[src].shape);
                            link.target(objects[dst].shape);
                            link.addTo(graph);
                        }
                    }
                }
            }

            constructor(target, nodes, core) {
                this.objects = this.extractGraph(nodes, core);
                this.draw(target);
            }
        }
    });