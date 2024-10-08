import React from 'react';
import AppIcon from './shared/appIcon';

export type SkillFilterProps = {
    value: string[];
    onChange: (skills: string[]) => void;
}

export const orderedSkills = ["Attack", "Hitpoints", "Mining", "Strength", "Agility", "Smithing", "Defence", "Herblore", "Fishing", "Ranged", "Thieving", "Cooking", "Prayer", "Crafting", "Firemaking", "Magic", "Fletching", "Woodcutting", "Runecraft", "Slayer", "Farming", "Construction", "Hunter"];
const extraSkills = ["Total", "Combat", "Base", "Quest", "Any", "Diary", "Favour"]
export class SkillFilter extends React.Component<SkillFilterProps>{
    constructor(props){
        super(props);
    }
    render(){
        return <div style={{display: 'flex', flexDirection: 'row'}}>
            <div className="skill-filter">
                {orderedSkills.map(os =>{ 
                    var selectedClass = this.props.value.indexOf(os) > -1 ? " selected" : "";
                    return <div className={"single-skill-filter" + selectedClass} onClick={() => this.skillClick(os)} title={os}>
                        <AppIcon name={os} ext="webp" size="sm"/>
                    </div>
                })}
            </div>
            <div className="extra-skill-filter">
                {extraSkills.map(os => {
                    var selectedClass = this.props.value.indexOf(os) >  -1 ? " selected" : "";
                    return <div className={"single-skill-filter" + selectedClass} onClick={() => this.skillClick(os)} title={os}>
                        <AppIcon name={os} ext={os == "Quest" ? "png" : "webp"} size="sm"/>
                    </div>
                })}
            </div>
        </div>
    }
    skillClick(skill){
        var val = this.props.value;
        if(val.indexOf(skill) > -1){
            val = val.filter(x => x != skill);
        } else{
            val = [...val, skill];
        }
        this.props.onChange(val);
    }
}