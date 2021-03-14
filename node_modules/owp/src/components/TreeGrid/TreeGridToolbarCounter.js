/**
 * @deprecated 트리그리드 내부 툴바를 대체하여 사용 하기로 함
 */
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

function countReducer(state, action) {
    switch (action.type) {
        case 'added':
            return { ...state, added: state.added + 1, total: state.total + 1 };

        case 'deleted':
            return {
                ...state,
                deleted: state.deleted + 1,
                total: state.total - 1,
                added: action.isAddedRow ? state.added - 1 : state.added,
            };

        case 'undeleted':
            return {
                ...state,
                deleted: state.deleted - 1,
                total: state.total + 1,
                added: action.isAddedRow ? state.added + 1 : state.added,
            };
        default:
            return state;
    }
}

const TreeGridToolbarCounter = ({
    countTotal,
    countAdded,
    countEdited,
    countDeleted,
}) => {
    // const [count, dispatchCountAction] = useReducer(countReducer, {
    //     total: rows.length,
    //     added: 0,
    //     deleted: 0,
    // });

    return (
        <div className="inline-flex">
            <div className="pr-16">
                <Typography inline variant="h6">
                    전체:
                </Typography>
                <Typography
                    inline
                    variant="h6"
                    color="secondary"
                    className="font-bold"
                >
                    &nbsp;
                    {countTotal}
                </Typography>
            </div>
            <div className="pr-16">
                <Typography inline variant="h6">
                    추가:
                </Typography>
                <Typography
                    inline
                    variant="h6"
                    color="secondary"
                    className="font-bold"
                >
                    &nbsp;
                    {countAdded}
                </Typography>
            </div>
            <div>
                <Typography inline variant="h6">
                    삭제:
                </Typography>
                <Typography
                    inline
                    variant="h6"
                    color="secondary"
                    className="font-bold"
                >
                    &nbsp;
                    {countDeleted}
                </Typography>
            </div>
        </div>
    );
};

TreeGridToolbarCounter.propTypes = {
    countTotal: PropTypes.number,
    countAdded: PropTypes.number,
    countDeleted: PropTypes.number,
};

TreeGridToolbarCounter.defaultProps = {
    countTotal: 0,
    countAdded: 0,
    countDeleted: 0,
};

export default TreeGridToolbarCounter;
