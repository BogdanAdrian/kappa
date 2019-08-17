import React from 'react';
import './Task1.scss';

export default class Task1 extends React.Component {
  constructor(props) {
    super(props);

    this.lastScrollTop = 0;
    this.squareRealLeftPosition = null;

    this.titleRef = React.createRef();
    this.squareRef = React.createRef();
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    window.document.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.document.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll(event) {
    var titleEl = this.titleRef.current;
    var squareEl = this.squareRef.current;
    const scrollTop = event.target.scrollingElement.scrollTop;

    titleEl.style.opacity = this.getOpacityByScrollPosition(scrollTop, 150, 400);
    squareEl.style.opacity = this.getOpacityByScrollPosition(scrollTop, 75, 400);
    if (this.squareRealLeftPosition === null) {
      squareEl.style.webkitTransform = "rotate(-" + this.getSquareRotationAngle(scrollTop, 75) + "deg)";
    }
    const squarePos = this.getSquarePosition(scrollTop, 75, squareEl);
    squareEl.style.left = squarePos.left + "px";
    squareEl.style.top = squarePos.top + "px";
    this.lastScrollTop = scrollTop;
  }

  getOpacityByScrollPosition(scrollTop, startTrigger, endTrigger) {
    if (scrollTop < startTrigger) {
      return 0;
    } else if (scrollTop > endTrigger) {
      return 1;
    } else {
      return (scrollTop - startTrigger) / (endTrigger - startTrigger);
    }
  }

  getSquareRotationAngle(scrollTop, startTrigger) {
    if (scrollTop < startTrigger) {
      return 0;
    } else {
      return parseInt((scrollTop * 50) / startTrigger + 40);
    }
  }

  getSquarePosition(scrollTop, startTrigger, squareEl) {
    const paddingLeft = 200;
    if (scrollTop < startTrigger) {
      return { left: squareEl.offsetLeft, top: squareEl.offsetTop };
    } else {
      const pixelsSinceLastScroll = scrollTop - this.lastScrollTop;
      const squareLeftPos = (this.squareRealLeftPosition !== null ? this.squareRealLeftPosition : squareEl.offsetLeft) - pixelsSinceLastScroll * 1.75;
      const squarePos = {
        left: squareLeftPos,
        top: squareEl.offsetTop - pixelsSinceLastScroll * 0.15
      };
      if (squarePos.left < paddingLeft) {
        this.squareRealLeftPosition = squarePos.left;
        squarePos.left = paddingLeft;
        squarePos.top = squareEl.offsetTop - pixelsSinceLastScroll * 0.7;
      } else {
        this.squareRealLeftPosition = null;
      }
      return squarePos;
    }
  }

  render() {
    return (
      <div className='task-1'>
        <div className="scroll-arrow">
          <div className="text">Scroll</div>
          <img
            className="arrow"
            alt='arrow'
            src="https://cdns.iconmonstr.com/wp-content/assets/preview/2018/240/iconmonstr-arrow-down-thin.png"
          />
        </div>
        <h2 ref={this.titleRef} className="title">Hey this is a nice title</h2>
        <div ref={this.squareRef} className="square"></div>
      </div>
    );
  }
}