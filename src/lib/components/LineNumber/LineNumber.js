import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './LineNumber.css';

export default class LineNumber extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {editorEl, editorDataArray, editorOptions, displayIndex} = this.props,
            len = editorDataArray.length,
            start = Math.max(displayIndex.start, 0),
            stop = Math.min(displayIndex.stop, len),
            {lineHeight, horizontalPadding} = editorOptions;

        let numbers = [], style;
        for (let i = start; i < stop; i++) {

            style = {
                lineHeight: `${lineHeight}px`,
                paddingLeft: horizontalPadding,
                paddingRight: horizontalPadding + 2,
                top: lineHeight * i
            };

            numbers.push(
                <div key={i}
                     className="react-editor-line-number-item"
                     style={style}>
                    {i + 1}
                </div>
            );

        }

        return (
            <div className="react-editor-line-number">
                {numbers}
            </div>
        );

    }
};

LineNumber.propTypes = {
    editorEl: PropTypes.object,
    editorDataArray: PropTypes.array,
    editorOptions: PropTypes.object,
    displayIndex: PropTypes.object
};

LineNumber.defaultProps = {
    editorEl: null,
    editorDataArray: [],
    editorOptions: null,
    displayIndex: null
};