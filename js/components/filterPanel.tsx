import React from 'react';
import { SkillFilter } from './skillFilter';
import { DifficultyFilter } from './difficultyFilter';
import { AreaFilter } from './areaFilter';
export type Filter = {
    skills: string[];
    personal: boolean;
    canComplete: boolean;
    showComplete: boolean;
    difficulty: string[];
    areas: string[];
    order?: {
        key?: string;
        desc?: boolean;
    }
}
export type FilterPanelProps = {
    filterUpdate: (filters: any) => void;
    filters: Filter;
}
export type FilterPanelState = {
}
export class FilterPanel extends React.Component<FilterPanelProps, FilterPanelState>{
    constructor(props){
        super(props);
        this.state = {
        };
    }
    render(){
        return <div className="filter-panel">
            <FilterPanelSection title="Ordering" clear={() => this.clearOrdering()}>
                <div className="ordering-filter">
                <label style={{marginRight: "8px"}}><select onChange={(e) => this.filterKeyChange(e.target.value)} value={this.filterKeyValue()}>
                    <option value="default">Default</option>
                    <option value="diff">Difficulty</option>
                </select></label>
                <div className="form-input">
                    <input type="checkbox" onChange={() => this.filterDescChange()} checked={this.filterDescValue()}/>
                    <label>Descending</label>
                </div>
                </div>
            </FilterPanelSection>
            <FilterPanelSection title="General" clear={() => this.clearGeneral()}>
                <div className="general-filter">
                    <div className="form-input">
                        <input id="personal-list" type="checkbox" onChange={() => this.generalChange('personal')} checked={this.isChecked('gen', 'personal')}></input>
                        <label htmlFor="personal-list">Personal list</label>
                    </div>
                    <div className="form-input">
                        <input id="able-to-complete" type="checkbox" onChange={() => this.generalChange('canComplete')} checked={this.isChecked('gen', 'canComplete')}></input>
                        <label htmlFor="able-to-complete">Able to complete</label>
                    </div>
                    <div className="form-input">
                        <input id="show-complete" type="checkbox" onChange={() => this.generalChange('showComplete')} checked={this.isChecked('gen', 'showComplete')}></input>
                        <label htmlFor="show-complete">Show complete</label>
                    </div>
                </div>
            </FilterPanelSection>
            <FilterPanelSection title="Skills" clear={() => this.clearSkills()}>
                <SkillFilter
                    value={this.props.filters.skills}
                    onChange={(s) => this.skillChange(s)}></SkillFilter>
            </FilterPanelSection>
            <FilterPanelSection title="Difficulty" clear={() => this.clearDiff()}>
                <DifficultyFilter
                    value={this.props.filters.difficulty}
                    onChange={(d) => this.difficultyChange(d)}/>    
            </FilterPanelSection>
            <FilterPanelSection title="Area" clear={() => this.clearArea()}>
                <AreaFilter
                    value={this.props.filters.areas}
                    onChange={(a) => this.areaChange(a)}/>
            </FilterPanelSection>
        </div>
    }
    isChecked(key, val){
        if(key == "gen"){
            if(val == 'personal'){
                return this.props.filters.personal;
            }
            if(val == "canComplete"){
                return this.props.filters.canComplete;
            }
            if(val == "showComplete"){
                return this.props.filters.showComplete;
            }
        }
    }
    skillChange(skillList){
        const newFilters = {...this.props.filters, skills: skillList};
        this.props.filterUpdate(newFilters);
    }
    generalChange(gen){
        const newFilters = {...this.props.filters};
        if(gen == 'personal'){
            newFilters.personal = !newFilters.personal;
        }
        if(gen == 'canComplete'){
            newFilters.canComplete = !newFilters.canComplete;
        }
        if(gen == "showComplete"){
            newFilters.showComplete = !newFilters.showComplete;
        }
        this.props.filterUpdate(newFilters);
    }
    difficultyChange(diffList){
        const newFilters = {...this.props.filters, difficulty: diffList};
        this.props.filterUpdate(newFilters);
    }
    areaChange(areaList){
        const newFilters = {...this.props.filters, areas: areaList};
        this.props.filterUpdate(newFilters);
    }
    filterKeyValue(){
        var filters = this.props.filters;
        return filters.order.key;
    }
    filterKeyChange(val){
        var filters = {...this.props.filters};
        filters.order.key = val;
        this.props.filterUpdate(filters);
    }
    filterDescValue(){
        var filters = this.props.filters;
        return filters.order.desc;
    }
    filterDescChange(){
        var filters = {...this.props.filters};
        filters.order.desc = !filters.order.desc;
        this.props.filterUpdate(filters);
    }
    clearOrdering(){
        var filters = {...this.props.filters};
        filters.order = {key: 'default', desc: false};
        this.props.filterUpdate(filters);
    }
    clearArea(){
        var filters = {...this.props.filters};
        filters.areas = [];
        this.props.filterUpdate(filters);
    }
    clearDiff(){
        var filters = {...this.props.filters};
        filters.difficulty = [];
        this.props.filterUpdate(filters);
    }
    clearSkills(){
        var filters = {...this.props.filters};
        filters.skills = [];
        this.props.filterUpdate(filters);
    }
    clearGeneral(){
        var filters = {...this.props.filters, canComplete: false, personal: false, showComplete: false};
        this.props.filterUpdate(filters);
    }
}

export type FilterPanelSectionProps = {
    children: any;
    title: string; 
    clear?: () => void;
};
export type FilterPanelSectionState = {
    collapsed: boolean;
}
export class FilterPanelSection extends React.Component<FilterPanelSectionProps, FilterPanelSectionState>{
    constructor(props){
        super(props);
        this.state = {
            collapsed: true
        };
    }
    render(){
        return <div className="filter-panel-section">
            <div onClick={() => this.setState({collapsed: !this.state.collapsed})} className="filter-panel-section-header"><p className={"filter-panel-section-title"}>{this.props.title}</p></div>
            {this.state.collapsed ? null : <div className="filter-panel-section-contents">{this.props.children}</div>}
            {this.props.clear && 
                <div className="filter-panel-clear" onClick={() => this.props.clear()} title="Reset to default">
                    <img className="filter-panel-reset-light" src={"icon/reset.png"}></img>
                    <img className="filter-panel-reset-dark" src={"icon/resetLight.png"}></img>
                </div>}
        </div>
    }
}