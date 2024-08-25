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
            <FilterPanelSection title="Ordering">
                <div style={{display: 'flex', flexDirection: 'column'}}>
                <label style={{marginRight: "8px"}}><select onChange={(e) => this.filterKeyChange(e.target.value)} value={this.filterKeyValue()}>
                    <option value="default">Default</option>
                    <option value="diff">Difficulty</option>
                </select></label>
                <label><input type="checkbox" onChange={() => this.filterDescChange()} value={this.filterDescValue()}/> Descending</label>
                </div>
            </FilterPanelSection>
            <FilterPanelSection title="General">
                <label><input type="checkbox" onChange={() => this.generalChange('personal')} checked={this.isChecked('gen', 'personal')}></input>Personal list</label>
                <label><input type="checkbox" onChange={() => this.generalChange('canComplete')} checked={this.isChecked('gen', 'canComplete')}></input>Able to complete</label>
                <label><input type="checkbox" onChange={() => this.generalChange('showComplete')} checked={this.isChecked('gen', 'showComplete')}></input>Show complete</label>
            </FilterPanelSection>
            <FilterPanelSection title="Skills">
                <SkillFilter
                    value={this.props.filters.skills}
                    onChange={(s) => this.skillChange(s)}></SkillFilter>
            </FilterPanelSection>
            <FilterPanelSection title="Difficulty">
                <DifficultyFilter
                    value={this.props.filters.difficulty}
                    onChange={(d) => this.difficultyChange(d)}/>    
            </FilterPanelSection>
            <FilterPanelSection title="Area">
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
}

export type FilterPanelSectionProps = {
    children: any;
    title: string; 
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
        </div>
    }
}