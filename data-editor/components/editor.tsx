import React from 'react';
import { EditorConfig, KeyValueQuestion, QuestionConfig } from '../types/editorConfig';
import {Reqs} from './table';
import Select from 'react-select';

export type EditorProps = {
    config: EditorConfig;
    save: (v: Reqs) => void;
    exit: () => void;
    initialValue: Reqs;
};
export type EditorState = {
    value: Reqs;
};
export class Editor extends React.Component<EditorProps, EditorState>{
    constructor(props){
        super(props);
        this.state = {
            value: this.props.initialValue
        };
    }
    componentDidUpdate(oldProps){
        if(oldProps.initialValue !== this.props.initialValue){
            this.setState({value: this.props.initialValue});
        }
    }
    addNewQuestion(){
        const updatedVal = [...this.state.value, {} as any];
        this.setState({value: updatedVal});
    }
    render(){
        return <form>
            {this.props.config.multiple 
                ? <div className="d-flex flex-column">
                    {this.state.value.map((v,i) => <div className="d-flex flex-column p-2" style={{border: "2px solid black"}}>
                        {this.props.config.questions.map(q => this.renderQuestion(q, v, i))}
                    </div>
                    )}
                    {/* add new question */}
                    <button className="btn btn-primary" type="button" onClick={() => this.addNewQuestion()}>Add new question</button>
                </div> 
                : this.props.config.questions.map(q => this.renderQuestion(q, this.state.value))}
            <button type="button" onClick={() => this.props.save(this.state.value)} className="btn btn-primary">Save updates</button>
            <button type="button" className="btn btn-warning" onClick={() => this.props.exit()}>Exit</button>
        </form>
    }
    valueChange(val: Reqs, key: string, index?: number){
        if(index !== undefined){
            //console.log("setting indexed value", index, this.state.value);
            const indexedValue = this.state.value[index];
            //console.log("indexed value", indexedValue);
            const updatedIndexVal = {...indexedValue, [key]: val};
            //console.log("updated index val", updatedIndexVal);
            const updatedVal = [...this.state.value];
            updatedVal.splice(index, 1, updatedIndexVal);
            //console.log("updated val", updatedVal);
            this.setState({value: updatedVal});
        } else {
            const updatedVal = {...this.state.value, [key]: val}
            //console.log("updatedVal", updatedVal);
            this.setState({value: updatedVal});
        }
    }
    renderQuestion(config: QuestionConfig, value: any, index?: number){
        const qValue = value[config.key];
        //console.log(value, qValue, config.key);
        return <Question key={config.key + "-" + index} value={qValue} question={config} onChange={(v) => this.valueChange(v, config.key, index)}/>
    }
}

export type QuestionProps = {
    value: any;
    onChange: (val: any) => void;
    question: QuestionConfig;
};
export type QuestionState = {
    newKvKey?: any;
    newKvValue?: any;
};
export class Question extends React.Component<QuestionProps, QuestionState>{
    constructor(props){
        super(props);
        this.state = {};
    }
    render(){
        const {key, multiple, type, options, min, max} = this.props.question;
        const label = this.props.question.label || (key.substring(0, 1).toUpperCase() + key.substring(1));
        const kvQuestionType = type as KeyValueQuestion;
        const questionType = type as QuestionConfig[];
        //console.log(key, this.props.value);
        return <div className="d-flex flex-column">
          <label>{label}</label>
          {type === "string" 
            && <input type="text" onChange={(e) => this.props.onChange(e.target.value)} value={this.props.value}/>}
          {type === "number" 
            && <input type="number" min={min} max={max} onChange={(e) => this.props.onChange(e.target.value)} value={this.props.value}/>}
          {type === "select" && multiple
          && <Select isMulti onChange={(e) => this.props.onChange(e.map(x => x.value))} value={(this.props.value||[]).map(x => ({value: x, label: x}))} options={options.map(x => ({value: x, label: x}))}>
          </Select>}
          {type === "select" && !multiple
          && <select onChange={(e) => this.props.onChange(e.target.value)} value={this.props.value}>
            {options.map(x => <option value={x}>{x}</option>)}
          </select>}
          {kvQuestionType.keyQuestion && <div className="d-flex flex-column">
                {Object.keys(this.props.value || {}).map(k => <div className="d-flex flex-row position-relative" key={k}>
                    <p className="w-25">{k}</p>
                    <p className="w-25">{this.props.value[k]}</p>
                    <button onClick={() => this.kvValueRemove(k)} type="button" className="btn btn-sm btn-primary">Remove</button>
                </div>)}
                <div className="d-flex flex-row position-relative">
                    <div>
                        {kvQuestionType.keyQuestion.type === "string" && <input type="text" value={this.state.newKvKey} onChange={(e) => this.kvValueChange(e.target.value, true)}/>}
                        {kvQuestionType.keyQuestion.type === "number" && <input type="number" value={this.state.newKvKey} onChange={(e) => this.kvValueChange(e.target.value, true)} min={kvQuestionType.valueQuestion.min} max={kvQuestionType.valueQuestion.max}/>}
                        {kvQuestionType.keyQuestion.type === "select" && <select value={this.state.newKvKey} onChange={(e) => this.kvValueChange(e.target.value, true)}>{kvQuestionType.keyQuestion.options.map(o => <option value={o}>{o}</option>)}</select>}
                    </div>
                    <div>
                        {kvQuestionType.valueQuestion.type === "string" && <input type="text" value={this.state.newKvValue} onChange={(e) => this.kvValueChange(e.target.value, false)}/>}
                        {kvQuestionType.valueQuestion.type === "number" && <input type="number" value={this.state.newKvValue} min={kvQuestionType.valueQuestion.min} max={kvQuestionType.valueQuestion.max} onChange={(e) => this.kvValueChange(e.target.value, false)}/>}
                        {kvQuestionType.valueQuestion.type === "select" && <select value={this.state.newKvValue} onChange={(e) => this.kvValueChange(e.target.value, false)}>{kvQuestionType.valueQuestion.options.map(o => <option value={o}>{o}</option>)}</select>}
                    </div>
                    <div className="kv-question-new-value-save">
                        <button className="btn btn-primary" type="button" onClick={() => this.kvValueAdd()}>Save</button>
                    </div>
                </div>
            </div>}
          {Array.isArray(questionType) && <div>
            {multiple
                ? (this.props.value||[]).map((subV, i) => questionType.map(sub => <Question question={sub} value={subV[sub.key]} onChange={(v) => this.subQuestionMultipleChange(v, sub.key, i)}/>))
                : questionType.map(sub => <Question question={sub} value={this.props.value[sub.key]} onChange={(v) => this.subQuestionChange(v, sub.key)}/>)}
            {multiple && <button type="button" onClick={() => this.addNewSubQuestionMultiple()}>Add</button>}
          </div>}
        </div>
    }
    addNewSubQuestionMultiple(){
        const newValue = [...(this.props.value || []), {}];
        this.props.onChange(newValue);
    }
    subQuestionMultipleChange(val: any, subKey: string, index: number){
        const newItemValue = {...this.props.value[index], [subKey]: val};
        const newValue = [...this.props.value];
        newValue.splice(index, 1, newItemValue);
        this.props.onChange(newValue);
    }
    subQuestionChange(val: any, subKey: string){
        const newVal = {...this.props.value, [subKey]: val};
        this.props.onChange(newVal);
    }
    kvValueChange(val: any, key: boolean){
        if(key){
            this.setState({newKvKey: val});
        } else {
            this.setState({newKvValue: val});
        }
    }
    kvValueAdd(){
        const newValue = {...(this.props.value || {}), [this.state.newKvKey]: this.state.newKvValue};
        this.props.onChange(newValue);
        this.setState({newKvValue: undefined, newKvKey: undefined})
    }
    kvValueRemove(key){
        const newValue = {...this.props.value || {}};
        delete newValue[key];
        this.props.onChange(newValue);
    }
}