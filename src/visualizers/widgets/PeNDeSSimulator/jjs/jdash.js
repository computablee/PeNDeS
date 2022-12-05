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
                        objects[core.getPath(actnode)] = {
                            type,
                            marking: core.getAttribute(actnode, 'Marking'),
                            x: oldnodes[node].pos.x,
                            y: oldnodes[node].pos.y,
                            ins: [],
                            outs: []
                        };
                    }
                    else if (type == 'Transition') {
                        objects[core.getPath(actnode)] = {
                            type,
                            x: oldnodes[node].pos.x,
                            y: oldnodes[node].pos.y,
                            ins: [],
                            outs: []
                        };
                    }
                }

                for (var node in oldnodes) {
                    let actnode = nodes[node].node;
                    let meta = core.getMetaType(actnode);
                    let type = meta ? core.getAttribute(meta, 'name') : null;

                    if (type == 'Inplace' || type == 'Outplace') {
                        let src = core.getPointerPath(actnode, 'src');
                        let dst = core.getPointerPath(actnode, 'dst');
                        objects[core.getPath(actnode)] = {
                            type: 'arc',
                            src,
                            dst,
                            x: oldnodes[node].pos.x, y: oldnodes[node].pos.y
                        };
                        if (objects[src]) objects[src].outs.push(dst);
                        if (objects[dst]) objects[dst].ins.push(src);
                    }
                }
                return objects;
            }

            getPathFromClick(clickId) {
                let objects = this.objects
                for (let obj in objects) {
                    let object = objects[obj];
                    if (object.shape && object.shape.id == clickId) {
                        return obj;
                    }
                }
                return null;
            }

            isEnabled(t) {
                let objects = this.objects;
                if (objects[t].type != "Transition") return false;

                let good = true;

                objects[t].ins.forEach(inp => {
                    if (objects[inp].marking == 0) {
                        good = false;
                    }
                });

                return good;
            }

            handleTransition(t, target) {
                let objects = this.objects;
                console.log("Here");
                if (objects[t] && objects[t].type != "Transition") return;
                else if (!objects[t]) return;

                if (this.isEnabled(t)) {
                    objects[t].ins.forEach(inp => {
                        objects[inp].marking--;
                    });

                    objects[t].outs.forEach(outp => {
                        objects[outp].marking++;
                    });

                    this.draw(target);
                }
            }

            draw(target) {
                let objects = this.objects
                console.log(objects);
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

                let self = this;

                paper.on('cell:pointerclick',
                    function (cellView, evt, x, y) {
                        console.log('cell view ' + self.getPathFromClick(cellView.model.id) + ' was clicked');
                        self.handleTransition(self.getPathFromClick(cellView.model.id), target);
                    }
                );

                let isProgressible = false;

                for (var node in objects) {
                    let obj = objects[node];
                    if (obj.type == 'Place') {
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
                                fill: this.isEnabled(node) ? (isProgressible = true, 'green') : 'red'
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

                if (!isProgressible) {
                    target.append('<h1>Network has no legal transitions!</h1>');
                }
            }

            constructor(target, nodes, core) {
                this.objects = this.extractGraph(nodes, core);
                this.draw(target);
            }
        }
    });