import React from 'react';

export type DifficultyFilterProps = {
    value: string[];
    onChange: (diffs: string[]) => void;
}
export class DifficultyFilter extends React.Component<DifficultyFilterProps>{
    constructor(props){
        super(props);
    }
    render(): React.ReactNode {
        return <div className="diff-filter">
            {["Easy", "Medium", "Hard", "Elite", "Master"].map(os => {
                var selectedClass = this.props.value.indexOf(os) > -1 ? " selected" : "";
                return <div className={"single-diff-filter" + selectedClass} title={os} onClick={() => this.diffClick(os)}>
                    <img src={"icon/" + os + "Task.webp"}></img>
                </div>
            })}
        </div>
    }
    diffClick(os){
        var val = this.props.value;
        if(val.indexOf(os) > -1){
            val = val.filter(x => x != os);
        } else {
            val = [...val, os];
        }
        this.props.onChange(val);
    }
}