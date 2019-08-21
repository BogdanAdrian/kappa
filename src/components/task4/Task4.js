import React from 'react';
import { Modal, Button } from 'antd';
import IntervalsScheduler from './IntervalsScheduler';
import 'antd/dist/antd.css';

import './Task4.scss';

export default class Task4 extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };

    this.showModal = this.showModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleOk = this.handleOk.bind(this);
  }

  handleOk(e) {
    this.setState({
      visible: false,
    });
  };

  handleCancel(e) {
    this.setState({
      visible: false,
    });
  };

  showModal() {
    this.setState({
      visible: true
    });
  }

  render() {
    return (
      <div className='task-4'>
        <Button type="primary" onClick={this.showModal}>
            Open intervals scheduler modal
        </Button>
        <Modal
          title="Set Full Spectrum Measurement Schedule"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <IntervalsScheduler ></IntervalsScheduler>
        </Modal>
      </div>
    );
  }
}