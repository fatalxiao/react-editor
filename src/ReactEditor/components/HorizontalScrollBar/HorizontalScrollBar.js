import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Valid from '../../utils/Valid';
import Event from '../../utils/Event';

import './HorizontalScrollBar.scss';

export default class HorizontalScrollBar extends Component {

    constructor(props) {

        super(props);

        this.wrapperWidth = props.editorWidth - props.editorOptions.scrollBarWidth
            - props.editorOptions.horizontalPadding * 2;
        this.scrollBarWidth = props.editorOptions.scrollBarMinLength;
        this.scrollBarLeft = 0;

        this.isWrapperMouseDown = false;
        this.isScrollBarMouseDown = false;
        this.mouseDownPosition = null;

        this.calculateScrollBarWidth = this::this.calculateScrollBarWidth;
        this.calculateLeft = this::this.calculateLeft;
        this.calculateScrollLeft = this::this.calculateScrollLeft;
        this.mouseDownHandle = this::this.mouseDownHandle;
        this.mouseMoveHandle = this::this.mouseMoveHandle;
        this.mouseUpHandle = this::this.mouseUpHandle;

    }

    calculateScrollBarWidth() {
        const {editorOptions, contentWidth} = this.props;
        return Valid.range(this.wrapperWidth ** 2 / contentWidth, editorOptions.scrollBarMinLength);
    }

    calculateLeft(scrollBarWidth = this.scrollBarWidth) {
        const {scrollLeft, contentWidth} = this.props;
        return (this.wrapperWidth - scrollBarWidth) * scrollLeft / (contentWidth - this.wrapperWidth);
    }

    calculateScrollLeft(left = this.scrollBarLeft, scrollBarWidth = this.scrollBarWidth) {
        const {contentWidth} = this.props;
        return (contentWidth - this.wrapperWidth) * left / (this.wrapperWidth - scrollBarWidth);
    }

    mouseDownHandle(e, isWrapper) {

        e.stopPropagation();
        isWrapper ? this.isWrapperMouseDown = true : this.isScrollBarMouseDown = true;

        this.mouseDownPosition = {
            left: e.clientX,
            top: e.clientY,
            scrollBarLeft: this.scrollBarLeft
        };

    }

    mouseMoveHandle(e) {

        e.stopPropagation();

        if (!this.isScrollBarMouseDown) {
            return;
        }

        const left = Valid.range(this.mouseDownPosition.scrollBarLeft + e.clientX - this.mouseDownPosition.left,
            0, this.wrapperWidth - this.scrollBarWidth);

        this.props.scrollX(this.calculateScrollLeft(left));

    }

    mouseUpHandle(e) {

        e.stopPropagation();

        const {editorOptions, scrollX} = this.props;

        // move scroll bar when wrapper mouse up
        if (this.isWrapperMouseDown
            && this.mouseDownPosition.left === e.clientX && this.mouseDownPosition.top === e.clientY) {

            this.scrollBarLeft = Valid.range(e.clientX - this.scrollBarWidth / 2 - editorOptions.horizontalPadding,
                0, this.wrapperWidth - this.scrollBarWidth);

            scrollX(this.calculateScrollLeft());

        }

        this.isWrapperMouseDown = false;
        this.isScrollBarMouseDown = false;
        this.mouseDownPosition = null;

    }

    componentDidMount() {
        Event.addEvent(document, 'mousemove', this.mouseMoveHandle);
        Event.addEvent(document, 'mouseup', this.mouseUpHandle);
    }

    componentWillUnmount() {
        Event.removeEvent(document, 'mousemove', this.mouseMoveHandle);
        Event.removeEvent(document, 'mouseup', this.mouseUpHandle);
    }

    render() {

        const {className, style} = this.props;

        this.scrollBarWidth = this.calculateScrollBarWidth();
        this.scrollBarLeft = this.calculateLeft();

        const scrollBarStyle = {
            width: this.scrollBarWidth,
            transform: `translate3d(${this.scrollBarLeft}px, 0, 0)`
        };

        return (
            <div className={`react-editor-horizontal-scroll-bar-wrapper ${className}`}
                 style={style}
                 onMouseDown={(e) => {
                     this.mouseDownHandle(e, true);
                 }}>
                <div className="react-editor-horizontal-scroll-bar"
                     style={scrollBarStyle}
                     onMouseDown={(e) => {
                         this.mouseDownHandle(e, false);
                     }}>
                    <div className="react-editor-horizontal-scroll-bar-inner"></div>
                </div>
            </div>
        );

    }
};

HorizontalScrollBar.propTypes = {

    className: PropTypes.string,
    style: PropTypes.object,

    editorWidth: PropTypes.number,
    editorOptions: PropTypes.object,
    scrollLeft: PropTypes.number,
    contentWidth: PropTypes.number,

    scrollX: PropTypes.func

};

HorizontalScrollBar.defaultProps = {

    className: '',
    style: null,

    editorWidth: 500,
    editorOptions: null,
    scrollLeft: 0,
    contentWidth: 0

};