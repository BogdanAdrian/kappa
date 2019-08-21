import React from "react";
import PropTypes from "prop-types";
import { hour24To12 } from "../utils";
import "./IntervalsScheduler.scss";

const WEEK_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
const HOURS = [
  "24",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12PM",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23"
];

export default class IntervalsScheduler extends React.Component {
  static propTypes = {
    intervals: PropTypes.arrayOf(
      PropTypes.shape({
        startDatetime: PropTypes.shape({
          day: PropTypes.number, // 0-6 Sun-Sat
          hour: PropTypes.number // 0-23
        }),
        duration: PropTypes.number
      })
    )
  };
  constructor(props) {
    super(props);

    this.intervalPopupRef = React.createRef();

    this.state = {
      intervals: props.intervals || [],
      selectedInterval: null,
      selectedDay: null,
      selectedHour: null,
      popoverVisible: false,
      stopMeasurement: {
        day: 1,
        hour: 3
      },
      popoverleft: -500,
      popoverTop: -500
    };

    this.handleIntervalChange = this.handleIntervalChange.bind(this);
    this.onHourClick = this.onHourClick.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.removeInterval = this.removeInterval.bind(this);
    this.stopMeasurementClick = this.stopMeasurementClick.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener(
      "mousedown",
      this.handleClickOutside.bind(this)
    );
  }

  componentDidUpdate(prevState) {
    if (prevState.intervals !== this.state.intervals) {
      console.log(this.state.intervals);
    }
  }

  closePopup() {
    this.setState({
      popoverVisible: false,
      selectedInterval: null,
      selectedDay: null,
      selectedHour: null
    });
  }

  handleClickOutside(event) {
    const { intervalPopupRef } = this;
    if (!intervalPopupRef.current.contains(event.target)) {
      this.setState({ popoverVisible: false });
    }
  }

  stopMeasurementClick() {
    this.setState({
      stopMeasurement: {
        day: this.state.selectedDay,
        hour: this.state.selectedHour
      }
    });
    this.closePopup();
  }

  getInterval(day, hour) {
    return this.state.intervals.find(
      interval =>
        interval.startDatetime.day === day &&
        interval.startDatetime.hour === hour
    );
  }

  onHourClick(day, hour) {
    const interval = this.getInterval(
      this.getDayAsNumber(day),
      this.getHourAsNumber(hour)
    );

    if (interval) {
      this.setState({
        selectedInterval: interval
      });
    }
    this.setState({
      selectedDay: this.getDayAsNumber(day),
      selectedHour: this.getHourAsNumber(hour)
    });
  }

  getDayAsNumber(day) {
    return WEEK_DAYS.findIndex(curDay => day === curDay);
  }

  getHourAsNumber(hour) {
    return HOURS.findIndex(curHour => hour === curHour);
  }

  getNewIntervalIndex(day, hour) {
    var newIntervalIndex = 0;
    for (let i = 0; i < this.state.intervals.length; i++) {
      const interval = this.state.intervals[i];
      if (
        interval.startDatetime.day < day ||
        (interval.startDatetime.day === day &&
          interval.startDatetime.hour < hour)
      ) {
        newIntervalIndex = i + 1;
      } else {
        break;
      }
    }
    return newIntervalIndex;
  }

  handleIntervalChange(event) {
    const newInterval = {
      startDatetime: {
        day: this.state.selectedDay,
        hour: this.state.selectedHour
      },
      duration: event.target.value
    };

    if (this.state.selectedInterval) {
      // update
      this.setState(curState => {
        const selectedIntervalIndex = curState.intervals.findIndex(
          item => item === this.state.selectedInterval
        );
        let intervals = curState.intervals;
        intervals.splice(selectedIntervalIndex, 1, newInterval);
        return {
          intervals
        };
      });
    } else {
      // new interval
      const newIntervalIndex = this.getNewIntervalIndex(
        this.state.selectedDay,
        this.state.selectedHour
      );
      this.setState(curState => {
        let intervals = curState.intervals;
        intervals.splice(newIntervalIndex, 0, newInterval);
        return {
          intervals
        };
      });
    }
    this.setState({ popoverVisible: false });
  }

  removeInterval() {
    const selectedIntervalIndex = this.state.intervals.findIndex(
      item => item === this.state.selectedInterval
    );
    if (selectedIntervalIndex < 0 && !this.state.stopMeasurement) {
      return;
    }
    if (
      this.state.selectedDay === this.state.stopMeasurement.day &&
      this.state.selectedHour === this.state.stopMeasurement.hour
    ) {
      // remove stop measurement
      this.setState({ stopMeasurement: { day: 7, hour: 0 } });
      this.closePopup();
      return;
    }
    const intervals = JSON.parse(JSON.stringify(this.state.intervals));
    intervals.splice(selectedIntervalIndex, 1);
    this.setState({ intervals });
    this.closePopup();
  }

  renderPopoverContent() {
    const { popoverTop, popoverleft, popoverVisible } = this.state;
    const popoverStyle = {
      top: popoverTop,
      left: popoverleft
    };

    return (
      <React.Fragment>
        <div
          ref={this.intervalPopupRef}
          className={[
            "measurement-interval-popup",
            popoverVisible ? "" : "hidden"
          ].join(" ")}
          style={popoverStyle}
        >
          <div className="header">
            <span className="title">Measurement Interval</span>
            <img
              className="trash-icon"
              onClick={this.removeInterval}
              src="https://cdn1.iconfinder.com/data/icons/basic-mobile-ios-android/24/Bin-512.png"
            />
            <img
              onClick={this.closePopup}
              className="close-icon"
              src="https://www.materialui.co/materialIcons/navigation/close_black_256x256.png"
            />
          </div>
          <div className="body">
            <select onChange={this.handleIntervalChange}>
              <option value="3 hours">3 hours</option>
              <option value="6 hours">6 hours</option>
              <option value="12 hours">12 hours</option>
              <option value="24 hours">24 hours</option>
            </select>
            <div
              className="stop-measurement"
              onClick={this.stopMeasurementClick}
            >
              Stop measurement
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  calculateTimeCarriedForward(intervalStartHour, intervalDuration) {
    var calculatedHour;
    var i = 0;
    do {
      calculatedHour = intervalStartHour + intervalDuration * i;
      i++;
    } while (calculatedHour <= 24);

    return 24 - (calculatedHour - intervalDuration);
  }

  doesIntervalClycleFinish(interval, day, hour) {
    if (
      day < interval.startDatetime.day ||
      (day === interval.startDatetime.day &&
        hour < interval.startDatetime.hour) ||
      day > this.state.stopMeasurement.day ||
      (day === this.state.stopMeasurement.day &&
        hour > this.state.stopMeasurement.hour)
    ) {
      return false;
    }
    const intervalDuration = parseInt(interval.duration);
    const timeCarriedForward = this.calculateTimeCarriedForward(
      interval.startDatetime.hour,
      parseInt(interval.duration)
    );

    if (interval.startDatetime.day === day) {
      if ((hour - interval.startDatetime.hour) % intervalDuration === 0) {
        return true;
      }
    } else if ((timeCarriedForward + hour) % intervalDuration === 0) {
      return true;
    }
    return false;
  }

  getScaleHoursElements() {
    return (
      <React.Fragment>
        {HOURS.map((hour, index) => {
          const hourToDisplay = hour24To12(hour);
          return <span key={index}>{hourToDisplay}</span>;
        })}
      </React.Fragment>
    );
  }

  getHoursElements(day = "", clickHandler = () => {}) {
    function hourClicked(day, hour, event) {
      const dayAsNumber = this.getDayAsNumber(day);
      const hourAsNumber = this.getHourAsNumber(hour);
      if (dayAsNumber > this.state.stopMeasurement.day || (dayAsNumber === this.state.stopMeasurement.day && hourAsNumber > this.state.stopMeasurement.hour)) {
        return;  
      }
      this.setState({
        popoverVisible: true,
        popoverleft: event.clientX - 100,
        popoverTop: event.clientY - 100
      });
      clickHandler.call(this, day, hour);
    }

    const intervalsStartDays = this.state.intervals.map(
      interval => interval.startDatetime.day
    );
    const intervalsStartHours = this.state.intervals.map(
      interval => interval.startDatetime.hour
    );
    const dayAsNumber = this.getDayAsNumber(day);

    return (
      <React.Fragment>
        {HOURS.map((hour, index) => {
          const hourToDisplay = hour24To12(hour);
          const hourAsNumber = this.getHourAsNumber(hour);

          let classNames = [];
          if (this.currentIntervalIndex + 1 < this.state.intervals.length) {
            if (
              intervalsStartDays[this.currentIntervalIndex + 1] ===
                dayAsNumber &&
              intervalsStartHours[this.currentIntervalIndex + 1] ===
                hourAsNumber
            ) {
              this.currentIntervalIndex++;
            }
          }

          if (
            intervalsStartDays[this.currentIntervalIndex] === dayAsNumber &&
            intervalsStartHours[this.currentIntervalIndex] === hourAsNumber
          ) {
            classNames.push("interval-start");
          } else if (
            this.state.intervals.length &&
            this.doesIntervalClycleFinish(
              this.state.intervals[this.currentIntervalIndex],
              dayAsNumber,
              hourAsNumber
            )
          ) {
            classNames.push("cycle-end");
          } else if (
            this.state.stopMeasurement.day === dayAsNumber &&
            this.state.stopMeasurement.hour === hourAsNumber
          ) {
            classNames.push("stop-measurement");
          }
          return (
            <span
              key={index}
              hour={hourToDisplay}
              onClick={hourClicked.bind(this, day, hour)}
              className={classNames.join(" ")}
            >
              {hourToDisplay}
            </span>
          );
        })}
      </React.Fragment>
    );
  }

  render() {
    this.currentIntervalIndex = 0;

    return (
      <div className="intervals-scheduler">
        <div className="schedule">
          {WEEK_DAYS.map((weekDay, i) => (
            <div className="week-day" key={i}>
              <span className="week-day-name">{weekDay}</span>
              <span className="hours">
                {this.getHoursElements(weekDay, this.onHourClick)}
              </span>
            </div>
          ))}
        </div>
        <div className="hours-scale">
          <span className="local-time">Site local time (GMT -7)</span>
          <span className="hours">{this.getScaleHoursElements()}</span>
        </div>
        <div className="warning-message">
          Minimum allowed measurement interval with selected sampling is 6
          hours.
        </div>
        {this.renderPopoverContent()}
      </div>
    );
  }
}
