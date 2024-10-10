import React from 'react';

export type Reqs = {
    skills: {[key: string]: number};
    quests: string[];
    diary: string[];
    kourend: {[key: string]: number};
    areas: (string|string[])[];
    links: {href: string; text: string}[];
}[]
type Parsed = Reqs;
type Panic = string;
type Raw = string;
type Manual = Reqs;

export type Datum = {
    id: number;
    name: string;
    diff: string;
    parsed: Parsed;
    panic: Panic;
    raw: Raw;
    manual: Manual;
}

export type DataTableProps = {
    dblClick: (a: any) => void;
    data: Datum[];
    selectedItem: any;
    selectedForList: number[]
};
export type DataTableState = {
}
export class DataTable extends React.Component<DataTableProps, DataTableState>{
    constructor(props){
        super(props);
        this.state = {
        }
    }
    render(){
        return <table className="table table-bordered">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Panic</th>
                    <th>Parsed</th>
                    <th>Raw</th>
                    <th>Manual</th>
                </tr>
            </thead>
            <tbody>
                {this.props.data.map(x => {
                    let props = {style: {}} as any;
                    let rowColor;
                    let fontWeight;
                    if(this.props.selectedItem?.id == x.id){
                        fontWeight = "bolder";
                    }
                    if(x.manual){
                        rowColor = '#00FF00';
                    } else if(x.panic){
                        rowColor = '#FF0000';
                    }
                    if(this.props.selectedForList.length){
                        if(this.props.selectedForList.indexOf(x.id) > -1){
                            rowColor = '#00FF00';
                        }
                    }
                    if(rowColor){
                        props.style.backgroundColor = rowColor;
                    }
                    if(fontWeight){
                        props.style.fontWeight = fontWeight;
                    }
                    return <tr onDoubleClick={() => this.props.dblClick(x)} key={x.id}>
                        <td {...props}>{x.id}</td>
                        <td {...props}>{x.name}</td>
                        <td {...props}>{x.panic}</td>
                        <td {...props}>{x.parsed && JSON.stringify(x.parsed)}</td>
                        <td {...props}>{x.raw}</td>
                        <td {...props}>{x.manual && JSON.stringify(x.manual)}</td>
                    </tr>
                })}
            </tbody>
        </table>
    }
}