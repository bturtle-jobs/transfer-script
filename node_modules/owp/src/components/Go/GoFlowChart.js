import PropTypes from 'prop-types';
import React, { useState } from 'react';
import GoDiagram from './GoDiagram';
import GoPalette from './GoPalette';

function GoFlowChart({
    paletteId,
    paletteModel,
    paletteProps,
    diagramId,
    diagramModel,
    diagramProps,
    ...restProps
}) {
    const [diagramInstance, setDiagramInstance] = useState(null);
    return (
        <div className="w-100 flex jusify-between" {...restProps}>
            <GoPalette
                style={{
                    width: '100px',
                    marginRight: '2px',
                    backgroundColor: 'whitesmoke',
                    border: 'solid 1px black',
                }}
                {...paletteProps}
                id={paletteId}
                model={paletteModel}
                nodeTemplateMap={
                    diagramInstance && diagramInstance.nodeTemplateMap
                }
            />
            <GoDiagram
                style={{
                    flexGrow: 1,
                    height: '750px',
                    border: 'solid 1px black',
                }}
                {...diagramProps}
                id={diagramId}
                model={{
                    class: 'go.GraphLinksModel',
                    linkFromPortIdProperty: 'fromPort',
                    linkToPortIdProperty: 'toPort',
                    ...diagramModel,
                }}
                onLoad={instance => {
                    setDiagramInstance(instance);
                }}
            />
        </div>
    );
}

GoFlowChart.propTypes = {
    paletteId: PropTypes.string,
    paletteModel: PropTypes.array.isRequired,
    paletteProps: PropTypes.object,
    diagramId: PropTypes.string,
    diagramModel: PropTypes.object.isRequired,
    diagramProps: PropTypes.object,
};

GoFlowChart.defaultProps = {
    paletteId: 'go-palette-1',
    paletteProps: {},
    diagramId: 'go-diagram-1',
    diagramProps: {},
};

export default GoFlowChart;
