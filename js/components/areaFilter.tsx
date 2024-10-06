import React from 'react';
import AppIcon from './shared/appIcon';

export type AreaFilterProps = {
    value: string[];
    onChange: (areas: string[]) => void;
}
export class AreaFilter extends React.Component<AreaFilterProps>{
    constructor(props){
        super(props);
    }
    render(): React.ReactNode {
        return <div className="area-filter">
            {["Any", "Asgarnia", "Desert", "Fremennik", "Kandarin", "Karamja", "Kourend", "Misthalin", "Morytania", "Tirannwn", "Wilderness"].map(os => {
                var selectedClass = this.props.value.indexOf(os) > -1 ? " selected" : "";
                return <div className={"single-area-filter" + selectedClass} title={os} onClick={() => this.areaClick(os)}>
                    <AppIcon name={os + "Area"} ext="webp" size="sm"/>
                </div>
            })}
        </div>
    }
    areaClick(os){
        var val = this.props.value;
        if(val.indexOf(os) > -1){
            val = val.filter(x => x != os);
        } else {
            val = [...val, os];
        }
        this.props.onChange(val);
    }
}