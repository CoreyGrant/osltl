import React from 'react';

export type FakeTableDatum = {
    display: (t: any) => React.Node;
    headerDisplay: () => React.Node;
}
export type FakeTableProps = {
    schema: FakeTableDatum[];
    data: any[];
    rowClasses: {[key: string]: string}
}
export class FakeTable extends React.Component<FakeTableProps>{
    constructor(props){
        super(props);
    }
    render(){
        const schema = this.props.schema;
        const data = this.props.data;
        return <div className="fake-table">
            <div className="fake-table-head">
                {schema.map((x, i) => <div className={"fake-table-th fake-table-th-" + i}>{x.headerDisplay()}</div>)}
            </div>
            <div className="fake-table-body">
                {data.map(x => {
                    var rowClass = Object.keys(this.props.rowClasses).filter(rc => x[rc]).map(rc => this.props.rowClasses[rc]).join(" ");
                    return <div className={"fake-table-row " + rowClass}>
                        {schema.map((s, i) => <div className={"fake-table-td fake-table-td-" + i}>{s.display(x)}</div>)}
                    </div>
                })}
            </div>
        </div>
    }
}