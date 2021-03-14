import { addHours, format, parse } from 'date-fns';
import * as go from 'gojs';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import { path } from 'ramda';
import React, { useEffect } from 'react';

let myDiagram;

const TICK_UNIT = 2;

function init(id, model = [], options = { size: 800 }) {
    const $ = go.GraphObject.make;

    myDiagram = $(go.Diagram, id, {
        layout: $(TimelineLayout),
        isTreePathToChildren: false,
    });

    myDiagram.nodeTemplate = $(
        go.Node,
        'Table',
        { locationSpot: go.Spot.Center, movable: false },
        $(
            go.Panel,
            'Auto',
            $(
                go.Shape,
                'RoundedRectangle',
                { strokeWidth: 3 },
                new go.Binding('fill', 'color', function(color) {
                    return path(['shape', 'fill'], color) || '#519ABA';
                }),
                new go.Binding('stroke', 'color', function(color) {
                    return (
                        path(['shape', 'stroke'], color) ||
                        path(['shape', 'fill'], color) ||
                        '#519ABA'
                    );
                })
            ),
            $(
                go.Panel,
                'Table',
                $(
                    go.TextBlock,
                    {
                        row: 0,
                        wrap: go.TextBlock.WrapFit,
                        font: 'Italic 10pt sans-serif',
                        textAlign: 'center',
                        margin: 4,
                    },
                    new go.Binding('stroke', 'color', function(color) {
                        return path(['event', 'stroke'], color) || '#FFFFFF';
                    }),
                    new go.Binding('text', 'event')
                ),
                $(
                    go.TextBlock,
                    {
                        row: 1,
                        stroke: '#fff',
                        textAlign: 'center',
                        margin: 4,
                    },
                    new go.Binding('stroke', 'color', function(color) {
                        return path(['event', 'stroke'], color) || '#FFFFFF';
                    }),
                    new go.Binding('text', 'date', function(d) {
                        return format(d, 'HH:mm:ss');
                    })
                )
            )
        )
    );

    myDiagram.nodeTemplateMap.add(
        'Line',
        $(
            go.Node,
            'Graduated',
            {
                movable: false,
                copyable: false,
                resizable: false,
                background: 'transparent',
                graduatedMin: 0,
                graduatedMax: 24 * TICK_UNIT,
                graduatedTickUnit: TICK_UNIT,
            },
            new go.Binding('graduatedMax', '', model.length),
            $(go.Shape, {
                geometryString: 'M0 0 H400',
                desiredSize: new go.Size(options.size, options.size),
            }),
            $(go.Shape, {
                geometryString: 'M0 0 V12',
                interval: 1,
                strokeWidth: 2,
                // alignmentFocus: go.Spot.Bottom,
            }),
            $(go.TextBlock, {
                interval: 1,
                alignmentFocus: go.Spot.MiddleRight,
                segmentOrientation: go.Link.OrientMinus90,
                segmentOffset: new go.Point(0, 16),
                graduatedFunction: n => {
                    return format(
                        addHours(options.start, n / TICK_UNIT),
                        'YYYY.MM.DD HH:mm'
                    );
                },
            })
        )
    );

    // The template for the link connecting the event node with the timeline bar node:
    myDiagram.linkTemplate = $(
        BarLink, // defined below
        { toShortLength: 2, layerName: 'Background' },
        $(go.Shape, { stroke: '#BBBBBB', strokeWidth: 2 })
    );
    // Setup the model data -- an object describing the timeline bar node
    // and an object for each event node:
    const data = [
        {
            // this defines the actual time "Line" bar
            key: 'timeline',
            category: 'Line',
            // lineSpacing: 30, // distance between timeline and event nodes
            length: options.size, // the width of the timeline
            ...options,
        },
        // the rest are just "events" --
        // you can add as much information as you want on each and extend the
        // default nodeTemplate to show as much information as you want
        ...model,
    ];
    // prepare the model by adding links to the Line
    for (let i = 0; i < data.length; i++) {
        const d = data[i];
        if (d.key !== 'timeline') d.parent = 'timeline';
    }
    myDiagram.model = $(go.TreeModel, { nodeDataArray: data });

    return myDiagram;
}

// This custom Layout locates the timeline bar at (0,0)
// and alternates the event Nodes above and below the bar at
// the X-coordinate locations determined by their data.date values.
function TimelineLayout() {
    go.Layout.call(this);
}
go.Diagram.inherit(TimelineLayout, go.Layout);
TimelineLayout.prototype.doLayout = function(coll) {
    const diagram = this.diagram;
    if (diagram === null) return;

    coll = this.collectParts(coll);
    diagram.startTransaction('TimelineLayout');

    const parts = [];
    const it = coll.iterator;

    let line = null;

    while (it.next()) {
        const part = it.value;
        if (part instanceof go.Link) continue;
        if (part.category === 'Line') {
            line = part;
            continue;
        }
        parts.push(part);
        let x = part.data.date;
        if (x === undefined) {
            x = new Date();
            part.data.date = x;
        }
    }
    if (!line) throw Error("No node of category 'Line' for TimelineLayout");
    line.location = new go.Point(0, 0);
    // lay out the events above the timeline
    if (parts.length > 0) {
        // determine the offset from the main shape to the timeline's boundaries
        // const main = line.findMainElement();
        // const sw = main.strokeWidth;
        // const mainOffX = main.actualBounds.x;
        // const mainOffY = main.actualBounds.y;
        // spacing is between the Line and the closest Nodes, defaults to 30
        let spacing = line.data.lineSpacing;
        if (!spacing) spacing = 30;
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const bnds = part.actualBounds;
            const dt = part.data.date;
            const val = dateToValue(dt, parts);
            const pt = line.graduatedPointForValue(val);
            const tempLoc = new go.Point(
                pt.x,
                pt.y - bnds.height / 2 - spacing
            );
            // check if this node will overlap with previously placed events, and offset if needed
            for (let j = 0; j < i; j++) {
                const partRect = new go.Rect(
                    tempLoc.x,
                    tempLoc.y,
                    bnds.width,
                    bnds.height
                );
                const otherLoc = parts[j].location;
                const otherBnds = parts[j].actualBounds;
                const otherRect = new go.Rect(
                    otherLoc.x,
                    otherLoc.y,
                    otherBnds.width,
                    otherBnds.height
                );
                if (partRect.intersectsRect(otherRect)) {
                    tempLoc.offset(0, -otherBnds.height - 10);
                    j = 0; // now that we have a new location, we need to recheck in case we overlap with an event we didn't overlap before
                }
            }
            part.location = tempLoc;
        }
    }
    diagram.commitTransaction('TimelineLayout');
};

// end TimelineLayout class
// This custom Link class was adapted from several of the samples
function BarLink() {
    go.Link.call(this);
}
go.Diagram.inherit(BarLink, go.Link);
BarLink.prototype.getLinkPoint = function(
    node,
    port,
    spot,
    from,
    ortho,
    othernode,
    otherport
) {
    const r = port.getDocumentBounds();
    const op = otherport.getDocumentPoint(go.Spot.Center);
    const main =
        node.category === 'Line'
            ? node.findMainElement()
            : othernode.findMainElement();
    const mainOffY = main.actualBounds.y;
    let y = r.top;
    if (node.category === 'Line') {
        y += mainOffY;
        if (op.x < r.left) return new go.Point(r.left, y);
        if (op.x > r.right) return new go.Point(r.right, y);
        return new go.Point(op.x, y);
    } else {
        return new go.Point(r.centerX, r.bottom);
    }
};
// end BarLink class

function dateToValue(d, parts) {
    const timeline = myDiagram.model.findNodeDataForKey('timeline');
    const startDate = timeline.start;
    const startDateMs =
        startDate.getTime() + startDate.getTimezoneOffset() * 60000;
    const dateInMs = d.getTime() + d.getTimezoneOffset() * 60000;
    const msSinceStart = dateInMs - startDateMs;
    const msPerHour = (60 * 60 * 1000) / TICK_UNIT;

    return msSinceStart / msPerHour;
}

function GoTimeline({ model, options, id, style, onLoad, ...domProps }) {
    useEffect(() => {
        const parsedModel = model.map(item => {
            return {
                ...item,
                date: parse(item.date),
            };
        });

        const canOptions = typeof options === 'object';
        const parsedModelDate =
            !canOptions &&
            !isEmpty(parsedModel) &&
            path(['0', 'date'], parsedModel).toLocaleDateString();

        const parsedOptions = canOptions
            ? {
                  ...options,
                  start: parse(options.start),
                  end: parse(options.end),
              }
            : {
                  // default without options
                  size: 900,
                  start: parse(`${parsedModelDate} 00:00:00`),
                  end: parse(`${parsedModelDate} 23:59:59`),
              };
        const diagram = init(id, parsedModel, parsedOptions);
        onLoad(diagram);
    }, []);

    return (
        <div
            id={id}
            style={{
                border: 'solid 1px black',
                background: '#FFFFFF',
                width: '100%',
                height: '1200px',
                ...style,
            }}
            {...domProps}
        />
    );
}

GoTimeline.propTypes = {
    model: PropTypes.array.isRequired,
    id: PropTypes.string,
    onLoad: PropTypes.func,
};

GoTimeline.defaultProps = {
    model: {},
    id: 'go-timeline-1',
    onLoad: () => {},
};

export default GoTimeline;
