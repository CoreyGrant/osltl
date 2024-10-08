import React from 'react';
import {editorConfig} from '../types/editorConfig';
import { Editor } from './editor';
import { DataTable, Datum } from './table';

export type AppState = {
    selected: Datum;
    data: Datum[];
    filters: {panic: boolean; manual: boolean};
    refreshing: boolean;
}
export class App extends React.Component<{}, AppState>{
    constructor(props){
        super(props);
        this.state = {
            selected: undefined,
            data: [],
            filters: {panic: false, manual: false},
            refreshing: false
        }
    }
    componentDidMount(){
        this.loadData();
    }
    loadData(){
        // load the data
        fetch('/data')
            .then(x => x.json())
            .then(x => this.setState({data: x}));
    }
    updateItem(id, v){
        // update the data 
        console.log("putting data", id, v);
        fetch('/data', {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({[id]: v})
        }).then(x => this.loadData());
    }
    toggleFilter(key){
        const filters = {...this.state.filters};
        filters[key] = !filters[key];
        this.setState({filters});
    }
    filteredData(){
        const {manual, panic} = this.state.filters
        if(manual && panic){
            return this.state.data.filter(x => x.manual || x.panic);
        } else if(manual){
            return this.state.data.filter(x => x.manual);
        }else if(panic){
            return this.state.data.filter(x => x.panic);
        } else {
            return this.state.data;
        }
        
    }
    refresh(){
        this.setState({refreshing: true}, () => {
            fetch('/refresh', {method: 'PUT'})
                .then(x => this.setState({refreshing: false}, () => this.loadData()));
        })
        
    }
    render(){
        const tableWidthString = this.state.selected ? 'w-50' : "w-100";
        return <div className="d-flex flex-row vh-100 position-relative w-100">
            <div className="position-fixed p-2 d-flex flex-row bg-white" style={{bottom: 0, left: 0, zIndex: "100"}}>
                <div className="d-flex flex-row me-2">
                    <input type="checkbox" checked={this.state.filters.panic} onChange={() => this.toggleFilter('panic')}/><label>Panic</label>
                </div>
                <div className="d-flex flex-row">
                    <input type="checkbox" checked={this.state.filters.manual} onChange={() => this.toggleFilter('manual')}/><label>Manual</label>
                </div>
            </div>
            <div className="position-fixed p-2" style={{bottom: 0, right: 0, zIndex: "100"}}>
                <button type="button" onClick={() => this.refresh()}>Refresh tasks</button>
                {this.state.refreshing && <p>...</p>}
            </div>
            <div className={tableWidthString + " vh-100 position-relative"}>
                <DataTable selected={(item) => {
                    this.setState({selected: item});
                }} data={this.filteredData()} selectedItem={this.state.selected}></DataTable>
            </div>
            {this.state.selected && <div className="w-50 vh-100 position-fixed bg-white p-2 overflow-auto" style={{right: "0", top: "0", borderLeft: "2px solid black"}}>
                <div className="parsed-data mb-2">
                    {this.state.selected && <code>
                        {JSON.stringify(this.state.selected.parsed, null, 2)}
                    </code>}
                </div>
                <div className="raw-data mb-2">
                    {this.state.selected && this.state.selected.raw}
                </div>
                {this.state.selected && <Editor config={editorConfig} initialValue={this.state.selected.manual || this.state.selected.parsed} save={(v) => this.saveEditor(this.state.selected.id, v)} exit={() => this.setState({selected: undefined})}></Editor>}
            </div>}
        </div>
    }
    saveEditor(id, v){
        this.updateItem(id, v);
        this.setState({selected: undefined});
    }
}