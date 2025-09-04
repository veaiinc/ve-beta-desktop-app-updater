import React, { Component } from 'react';
import { Calendar, TimePicker, Select } from 'antd';
import moment from 'moment';
import './scheduler.scss';

class Scheduler extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDate: moment(),
            timeZone: 'Indian Standard Time (IST): UTC+5:30',
        };
    }

    // ... existing code ...

    render() {
        return (
            <div className="scheduler-container">
                <div className="appointment-header">
                    <h2>Appointment</h2>
                    <div className="service-details">
                        <h3>All-Natural Beauty Ritual</h3>
                        <p>2 hours | $600.00</p>
                    </div>
                    <div className="team-members">
                        <h4>Team Members</h4>
                        <div className="member-avatars">
                            {/* Add team member avatars and names here */}
                        </div>
                    </div>
                </div>

                <div className="scheduling-section">
                    <div className="calendar-section">
                        <Calendar
                            fullscreen={false}
                            onChange={this.onDateChange}
                            value={this.state.selectedDate}
                            headerRender={({ value, onChange }) => (
                                <div className="calendar-header">
                                    <h3>{value.format('MMMM YYYY')}</h3>
                                    <div className="navigation-buttons">
                                        <button onClick={() => onChange(value.clone().subtract(1, 'month'))}>
                                            {'<'}
                                        </button>
                                        <button onClick={() => onChange(value.clone().add(1, 'month'))}>
                                            {'>'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                    <div className="time-section">
                        <Select
                            value={this.state.timeZone}
                            style={{ width: '100%', marginBottom: '20px' }}
                            onChange={(value) => this.setState({ timeZone: value })}
                        >
                            <Select.Option value="Indian Standard Time (IST): UTC+5:30">
                                Indian Standard Time (IST): UTC+5:30
                            </Select.Option>
                        </Select>

                        <div className="time-slots">
                            <h4>AM</h4>
                            <div className="slot-buttons">
                                <button>9:30 AM</button>
                                <button>11:30 AM</button>
                                <button>11:30 AM</button>
                                <button>11:30 AM</button>
                            </div>

                            <h4>PM</h4>
                            <div className="slot-buttons">
                                <button>2:30 PM</button>
                                <button>5:00 PM</button>
                                <button>5:00 PM</button>
                                <button>5:00 PM</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Scheduler;
