import React, {Component} from 'react';
import PropTypes from 'prop-types';

import TextInput from '../TextInput';
import TextActiveLine from '../TextActiveLine';
import TextSelection from '../TextSelection';
import TextContainer from '../TextContainer';
import EditorCursor from '../EditorCursor';

import './TextScroller.css';

export default class TextScroller extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {
                isEditorFocused, editorHeight, editorDataArray, editorOptions, contentWidth, scrollTop, scrollLeft,
                gutterWidth, selectStartPosition, selectStopPosition, cursorPosition
            } = this.props,
            {horizontalPadding, lineHeight, showLineNumber} = editorOptions,
            initOffsetLeft = horizontalPadding + (showLineNumber ? gutterWidth : 0),
            scrollerStyle = {
                width: contentWidth,
                height: (editorDataArray.length - 1) * lineHeight + editorHeight,
                transform: `translate3d(${initOffsetLeft - scrollLeft}px, ${-scrollTop}px, 0)`
            };

        return (
            <div className="react-editor-text-scroller"
                 style={scrollerStyle}>

                {
                    cursorPosition ?
                        <TextInput {...this.props}/>
                        :
                        null
                }

                {
                    cursorPosition ?
                        <TextActiveLine {...this.props}/>
                        :
                        null
                }

                {
                    selectStartPosition && selectStopPosition ?
                        <TextSelection {...this.props}/>
                        :
                        null
                }

                <TextContainer {...this.props}/>

                {
                    cursorPosition && isEditorFocused ?
                        <EditorCursor {...this.props}/>
                        :
                        null
                }

            </div>
        );

    }
};

TextScroller.propTypes = {
    isEditorFocused: PropTypes.bool,
    editorDataArray: PropTypes.array,
    editorOptions: PropTypes.object,
    contentWidth: PropTypes.number,
    scrollTop: PropTypes.number,
    scrollLeft: PropTypes.number,
    gutterWidth: PropTypes.number,
    selectStartPosition: PropTypes.object,
    selectStopPosition: PropTypes.object,
    cursorPosition: PropTypes.object
};

TextScroller.defaultProps = {
    isEditorFocused: false,
    editorDataArray: [],
    editorOptions: null,
    contentWidth: 0,
    scrollTop: 0,
    scrollLeft: 0,
    gutterWidth: 0,
    selectStartPosition: null,
    selectStopPosition: {
        left: 0,
        top: 0,
        row: 0,
        col: 0
    },
    cursorPosition: {
        left: 0,
        top: 0,
        row: 0,
        col: 0
    }
};