import React from 'react';
import { SkillFilter } from './skillFilter';
export type Filter = {
    skills: string[];
    personal: boolean;
    canComplete: boolean;
    showComplete: boolean;
    difficulty: string[];
    areas: string[];
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
                <label><input type="checkbox" onChange={() => this.difficultyChange('Easy')} checked={this.isChecked('diff', 'Easy')}></input>Easy</label>
                <label><input type="checkbox" onChange={() => this.difficultyChange('Medium')} checked={this.isChecked('diff', 'Medium')}></input>Medium</label>
                <label><input type="checkbox" onChange={() => this.difficultyChange('Hard')} checked={this.isChecked('diff', 'Hard')}></input>Hard</label>
                <label><input type="checkbox" onChange={() => this.difficultyChange('Elite')} checked={this.isChecked('diff', 'Elite')}></input>Elite</label>
                <label><input type="checkbox" onChange={() => this.difficultyChange('Master')} checked={this.isChecked('diff', 'Master')}></input>Master</label>
            </FilterPanelSection>
            <FilterPanelSection title="Area">
                <label><input type="checkbox" onChange={() => this.areaChange('Any')} checked={this.isChecked('area', 'Any')}></input>Any</label>
                <label><input type="checkbox" onChange={() => this.areaChange('Asgarnia')} checked={this.isChecked('area', 'Asgarnia')}></input>Asgarnia</label>
                <label><input type="checkbox" onChange={() => this.areaChange('Desert')} checked={this.isChecked('area', 'Desert')}></input>Desert</label>
                <label><input type="checkbox" onChange={() => this.areaChange('Fremennik')} checked={this.isChecked('area', 'Fremmenik')}></input>Fremmenik</label>
                <label><input type="checkbox" onChange={() => this.areaChange('Kandarin')} checked={this.isChecked('area', 'Kandarin')}></input>Kandarin</label>
                <label><input type="checkbox" onChange={() => this.areaChange('Karamja')} checked={this.isChecked('area', 'Karamja')}></input>Karamja</label>
                <label><input type="checkbox" onChange={() => this.areaChange('Kourend')} checked={this.isChecked('area', 'Kourend')}></input>Kourend</label>
                <label><input type="checkbox" onChange={() => this.areaChange('Misthalin')} checked={this.isChecked('area', 'Misthalin')}></input>Misthalin</label>
                <label><input type="checkbox" onChange={() => this.areaChange('Morytania')} checked={this.isChecked('area', 'Morytania')}></input>Morytania</label>
                <label><input type="checkbox" onChange={() => this.areaChange('Tirannwn')} checked={this.isChecked('area', 'Tirannwn')}></input>Tirannwn</label>
                <label><input type="checkbox" onChange={() => this.areaChange('Wilderness')} checked={this.isChecked('area', 'Wilderness')}></input>Wilderness</label>
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
        if(key == 'diff'){
            return this.props.filters.difficulty.indexOf(val) > -1;
        }
        if(key == 'area'){
            return this.props.filters.areas.indexOf(val) > -1;
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
    difficultyChange(diff){
        var diffList = this.props.filters.difficulty;
        if(diffList.indexOf(diff) > -1){
            diffList = diffList.filter(x => x != diff);
        } else {
            diffList = [...diffList, diff];
        }
        const newFilters = {...this.props.filters, difficulty: diffList};
        this.props.filterUpdate(newFilters);
    }
    areaChange(area){
        var areaList = this.props.filters.areas;
        if(areaList.indexOf(area) > -1){
            areaList = areaList.filter(x => x != area);
        } else {
            areaList = [...areaList, area];
        }
        const newFilters = {...this.props.filters, areas: areaList};
        this.props.filterUpdate(newFilters);
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
            <div onClick={() => this.setState({collapsed: !this.state.collapsed})} style={{cursor: 'pointer'}}><h4>{this.props.title}</h4></div>
            {this.state.collapsed ? null : <div className="filter-panel-section-contents">{this.props.children}</div>}
        </div>
    }
}