import React from 'react';

export type FakeTableDatum = {
    display: (t: any) => React.ReactNode;
    headerDisplay: () => React.ReactNode;
}
export type FakeTableInfiniteScroll = {
    initialAmount: number;
    loadAmount?: number;
    scrollPercent?: number;
}
export type FakeTableProps = {
    schema: FakeTableDatum[];
    data: any[];
    rowClasses: {[key: string]: string};
    rowClick?: (item) => void;
    infiniteScroll?: FakeTableInfiniteScroll;
}
export type FakeTableState = {
    currentData: any[];
}

export class FakeTable extends React.Component<FakeTableProps, FakeTableState>{
    fakeTableBodyRef;
    constructor(props: FakeTableProps){
        super(props);
        this.state = {
            currentData: props.data
        }
        this.fakeTableBodyRef = React.createRef();
    }
    componentDidMount(){
        if(this.props.infiniteScroll){
            const initialAmount = this.props.infiniteScroll.initialAmount;
            const loadAmount = this.props.infiniteScroll.loadAmount ?? initialAmount;
            const scrollPercent = (this.props.infiniteScroll.scrollPercent ?? 20)/100;
            const scrollElm = this.fakeTableBodyRef.current;
            const currentData = this.state.currentData;
            const initialCurrentData = currentData.slice(0, initialAmount);
            scrollElm.addEventListener('scroll', () => {
                const remainingPercent = (scrollElm.scrollHeight - scrollElm.scrollTop)/scrollElm.scrollHeight;
                if(remainingPercent > scrollPercent){
                    const currentDataLength = this.state.currentData.length;
                    const newDataLength = currentDataLength + loadAmount;
                    let newCurrentData;
                    if(newDataLength >= this.props.data.length){
                        newCurrentData = this.props.data;
                    } else {
                        newCurrentData = this.props.data.slice(0, currentDataLength + loadAmount);
                    }
                    this.setState({currentData: newCurrentData});
                }
            });
            this.setState({currentData: initialCurrentData});
        }
    }
    render(){
        const schema = this.props.schema;
        let data = this.state.currentData;
        
        return <div className="fake-table">
            <div className="fake-table-head">
                {schema.map((x, i) => <div className={"fake-table-th fake-table-th-" + i}>{x.headerDisplay()}</div>)}
            </div>
            <div className="fake-table-body" ref={this.fakeTableBodyRef}>
                {data.map(x => {
                    var rowClass = Object.keys(this.props.rowClasses).filter(rc => x[rc]).map(rc => this.props.rowClasses[rc]).join(" ");
                    return <div className={"fake-table-row " + rowClass} onClick={() => this.props.rowClick && this.props.rowClick(x)}>
                        {schema.map((s, i) => <div className={"fake-table-td fake-table-td-" + i}>{s.display(x)}</div>)}
                    </div>
                })}
            </div>
        </div>
    }
}