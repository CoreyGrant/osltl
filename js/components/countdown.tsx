import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);
const releaseDate = dayjs("2024-11-27 09:00");
export type CountdownState = {
    remaining: Dayjs;
};
export class Countdown extends React.Component<{}, CountdownState>{
    constructor(props){
        super(props);
        this.state = {remaining: this.getRemaining()};
    }
    interval;
    componentDidMount(): void {
        this.interval = setInterval(() => {
            var newRemaining = this.getRemaining();
            this.setState({remaining: newRemaining});
        }, 100);
    }
    render(){
        if(!this.state.remaining){
            clearInterval(this.interval);
            return;
        }
        return <div className="countdown">
            {/*<p>Release: {releaseDate.format("DD/MM/YYYY @ HH:mm")}</p>*/}
            <p>Remaining: {this.formatRemaining(this.state.remaining)}</p>
        </div>
    }
    formatRemaining(remaining){
        var months = remaining.format("M");
        var days = remaining.format("D");
        return months + (months == 1 ? " month " : " months ")
            + days + (days == 1 ? " day " : " days " )
            + remaining.format("H") + "h "
            + remaining.format("m") + "m "
            + remaining.format("s") + "s ";
    }
    getRemaining(): any{
        var now = dayjs();
        if(releaseDate < now){
            return;
        }
        return dayjs.duration(Math.abs(releaseDate.diff(now)));
    }
}