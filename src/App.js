import logo from './logo.png';
import './App.css';
import React from 'react';

class SubjectItem extends React.Component {
    constructor(props) {
        super(props);
        this.subNameChanged = this.subNameChanged.bind(this)
        this.scoreChanged = this.scoreChanged.bind(this)
        this.creditChanged = this.creditChanged.bind(this)
        this.setGrade = this.setGrade.bind(this)
        this.itemRemove = this.itemRemove.bind(this)
    }

    subNameChanged(event) {
        let p = this.props;
        p.data.subName = event.target.value.toString()
        this.props.onDataChanged(p.index, p.data)
    }

    scoreChanged(event) {
        let p = this.props;
        p.data.Score = Number.parseFloat(event.target.value)
        this.setGrade(p)
    }

    creditChanged(event) {
        let p = this.props;
        p.data.Credit = Number.parseFloat(event.target.value)
        this.setGrade(p)
    }

    setGrade(p) {
        let g = 0.0
        if (isNaN(p.data.Score)) g = null
        else if (p.data.Score >= 60) {
            g = 2.0 + (p.data.Score - 60) * 0.2
        }
        p.data.Grade = g
        this.props.onDataChanged(p.index, p.data)
    }

    itemRemove() {
        this.props.itemRemove(this.props.index)
    }

    render() {
        const subName = this.props.data.subName
        const Credit = this.props.data.Credit
        const Score = this.props.data.Score
        const Grade = this.props.data.Grade
        return (
            <div className="sub-area">
                <div className="delBtn">
                    <button onClick={this.itemRemove}>-</button>
                </div>
                <div className="sub-con">
                    <div className="row">
                        <div className="cell">
                            <input className="subInp" placeholder={'科目' + (this.props.index + 1)} type="text"
                                   maxLength='50'
                                   value={subName} onChange={this.subNameChanged}/>
                        </div>
                        <div className="cell">
                            <input className="grade" placeholder='绩点' readOnly
                                   value={Grade != null ? ("单科绩点:" + Grade.toFixed(2)) : ""}/>
                        </div>

                    </div>
                    <div className="row">
                        <div className="creditInp">
                            <input placeholder='输入学分' type="number" step="0.1" min='0' value={Credit}
                                   onChange={this.creditChanged}/>
                            <div className="inpTip">/学分</div>
                        </div>

                        <div className="scoreInp">
                            <input placeholder='输入分数' type="number" step="0.1" min='0' value={Score}
                                   onChange={this.scoreChanged}/>
                            <div className="inpTip">/分</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class Gpa extends React.Component {
    render() {
        if (this.props.gpa != null) {
            return (
                <li className="gpa-con">
                    {this.props.gpa}
                    <div className="gpa-title">GPA</div>
                </li>
            )
        } else return ""
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subList: [],
            cnt: 0
        }
        this.getList = this.getList.bind(this)
        this.dataChanged = this.dataChanged.bind(this)
        this.itemRemove = this.itemRemove.bind(this)
        this.itemAdd = this.itemAdd.bind(this)
        this.clearList = this.clearList.bind(this)
        this.itemAdd()
    }

    dataChanged(index, data) {
        let subList = this.state.subList
        subList[index] = data
        this.setState({
            subList: subList
        })
    }

    itemRemove(index) {
        let l = this.state.subList
        l.splice(index, 1)
        this.setState({
            subList: l
        })
    }

    itemAdd() {
        let l = this.state.subList
        const i = this.state.cnt + 1;
        this.setState({
            cnt: i
        })

        l.push({
            index: i,
            subName: "",
            Score: null,
            Credit: null,
            Grade: null
        })
        this.setState({
            subList: l
        })
    }

    clearList() {
        this.setState({
            subList: [{
                subName: "",
                Score: null,
                Credit: null,
                Grade: null
            }]
        })
    }

    getList() {
        return this.state.subList.map((s, i) => {
            return <li><SubjectItem key={s.index} index={i} data={s} onDataChanged={this.dataChanged}
                                    itemRemove={this.itemRemove}/></li>
        })
    }

    calGPA() {
        let sumGrade = 0;
        let sumCredit = 0;
        for (let i = 0; i < this.state.subList.length; i++) {
            if (isNaN(this.state.subList[i].Credit) || isNaN(this.state.subList[i].Grade)) return null
            sumCredit += this.state.subList[i].Credit
            sumGrade += this.state.subList[i].Grade * this.state.subList[i].Credit
        }
        return isFinite(sumGrade / sumCredit) ? (sumGrade / sumCredit).toFixed(2) : null
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1>SAU绩点计算器</h1>
                    <h2>供沈航师生使用</h2>
                    <p>
                        <a href="https://github.com/BladeHiker">
                            <img className="about" alt="version"
                                 src="https://img.shields.io/badge/BladeHiker-v1.0-blue.svg?style=flat&logo=github"/>
                        </a>
                    </p>

                </header>
                <div className="main-con">
                    <ol>
                        <li>
                            <p className="container tips">Tips:评级类学科分数填写方法 <hr/>优秀 = 95，良好 = 85，中等 = 75，及格 = 65，不及格 = 0<br/>通过、不通过、取消的科目不参与计算
                            </p>
                        </li>
                        <li>
                            <p className="container tips-red">Tips:补考及缓考科目 <hr/>补考看最近一次补考成绩，若超过60分按60分填写<br/>缓考成绩正常填写
                            </p>
                        </li>
                        {this.getList()}
                        <li>
                            <button className="addBtn addBtnAni" onClick={this.itemAdd}>+</button>
                        </li>
                        <li>
                            <button className="clearBtn clearBtnAni" onClick={this.clearList}>重置</button>
                        </li>
                        <Gpa gpa={this.calGPA()}/>
                    </ol>


                </div>
            </div>
        );
    }

}

export default App;
