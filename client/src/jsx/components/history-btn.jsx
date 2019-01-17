import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed, observe} from 'mobx'
import {observer, inject} from 'mobx-react'
import moment from 'moment'

class HistoryBtn extends Component {
  
  constructor() {

    super();
    extendObservable(this,
                     { assDates: computed(() => this.props.dates) });
  }


  componentDidMount() {

    const date = new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000);
    const year = date.getFullYear();
    const self = this;
    const d = new Date(Date.now());
    const lDate = d.getDate();
    const lMonth = d.getMonth();
    const lYear = d.getFullYear();
    const startDate = lYear + '-' + (lMonth+1) + '-' + lDate;

    $(ReactDOM.findDOMNode(this.refs.calendar)).datetimepicker({
      format: 'm/d/Y',
      yearStart: 2016,
      yearEnd: year,
      timepicker: false,
      scrollInput: false,
      defaultSelect: false,
      todayButton: false,
      // inline: true,
      startDate: startDate,
      minDate: 0,
      maxDate: 0,
      allowDates: self.props.dates,
      formatDate: 'Y-m-d',
      onGenerate:function(ct){
        const clName = "history " + (self.props.user ? self.props.user.user_type : "");
        $(this).addClass(clName);
        $("td[data-date=" + lDate + "][data-month=" + lMonth + "][data-year=" + lYear + "]").addClass('xdsoft_disabled');
        self.props.dates.map((assDate, index) => {
                               const mDate = moment(assDate);
                               const selector = `td[data-date=${mDate.date()}][data-month=${mDate.month()}][data-year=${mDate.year()}]`;
                               $(selector).removeClass('xdsoft_disabled');
                               if (index == self.props.dates.length - 1) {
                                 $(selector).addClass('latest');
                               }
                             });
      },
      onSelectDate: ct => {
        self.props.history.push(`/dashboard/${self.props.link}/history/${moment(ct).format("YYYY-MM-DD")}`);
      }
    });
  }

  render() {

    return (
      <button className="button border responsive" ref="calendar">
        <span className="psr-icons icon-calender"></span>
        <span className="show-for-large"> History</span>
      </button>
    )
  }
}

export default observer(HistoryBtn)