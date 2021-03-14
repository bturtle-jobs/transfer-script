import * as go from 'gojs';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

const $ = go.GraphObject.make;

function GoPalette({ nodeTemplateMap, model, id, ...domProps }) {
    useEffect(() => {
        if (nodeTemplateMap) {
            $(go.Palette, id, {
                nodeTemplateMap, // share the templates used by myDiagram
                model: new go.GraphLinksModel(model),
            });
        }
    }, [nodeTemplateMap]);

    return <div id={id} {...domProps} />;
}

PropTypes.propTypes = {
    id: PropTypes.string.isRequired,
    nodeTemplateMap: PropTypes.array.isRequired,
    model: PropTypes.array.isRequired,
};

export default GoPalette;
