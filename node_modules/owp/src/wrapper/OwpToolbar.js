import { Button, Icon, Typography, withStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import PrintIcon from '@material-ui/icons/Print';
import RemoveIcon from '@material-ui/icons/Remove';
import SaveIcon from '@material-ui/icons/Save';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import FuseAnimate from '../@fuse/components/FuseAnimate/FuseAnimate';
import OwpDialog from "./OwpDialog";
import OwpPermit from "./OwpPermit";

const propTypes = {
    className : PropTypes.string,
    pageid    : PropTypes.string,
    title     : PropTypes.string,
    buttons   : PropTypes.array,
    customButtons: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired
        })
    ),
    callFunction : PropTypes.func
};

const defaultProps = {
    className: '',
    pageid  : '',
    title   : "TITLE",
    buttons : [],
    customButtons : []
};

const styles = theme => ({
    root: {},
    button: {
        margin: theme.spacing.unit,
        whiteSpace: 'noWrap'
    },
    leftIcon : {
        marginRight: theme.spacing.unit
    },
    rightIcon: {
        marginLeft: theme.spacing.unit
    },
    iconSmall: {
        fontSize: 16
    }
});

function TitleNullTest(title) { // title의 값이 null로 들어올 경우 앞의 * icon을 표시 안 해주기 위한 함수
    if(title !== null){
        return(
            <div className="flex flex-shrink items-center">
                <FuseAnimate animation="transition.expandIn" delay={300}>
                    <Icon className="text-32 mr-12 c04">blur_on</Icon>
                </FuseAnimate>
                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                    <Typography variant="h6" className="hidden sm:flex text-nowrap">{title}</Typography>
                </FuseAnimate>
            </div>
        );

    }
}

class OwpToolbar extends Component {

    state = {
        addState: true,
        saveState: false,
        deleteState: false,
        copyState: false,
        buttonDelete: false,
        updateState: false
    };

    constructor(props) {
        super(props);
    }

    onSelect = (R) => {
        this.setState({
            deleteState:R,
            copyState:R,
            addState:!R,
            saveState:!R,
            updateState:R,
        });
    }

    initState = () => {
        this.setState({
            addState: true,
            saveState: false,
            deleteState: false,
            copyState: false,
            buttonDelete: false,
            updateState: false,
        });

        //this.setState(OwpPermit(this.props.pageid));
    }

    componentDidMount() {
        if(this.props.pageid!==undefined || this.props.pageid!==""){
            this.setState(OwpPermit(this.props.pageid));
        }
    }

    onSave = () => {
        this.props.callFunction('save');
    }

    render() {

        const {title,buttons,customButtons,classes,className} = this.props;
        const {addState,saveState,deleteState,copyState,updateState} = this.state;

        const {C_PERMISSION,U_PERMISSION,D_PERMISSION,R_PERMISSION} = this.state;

        //console.log('addState',addState)

        return (

            <React.Fragment>

                <div className={classNames(classes.root, "flex flex-1 items-center justify-between px-16", className)}>
                    <div className="flex flex-shrink items-center ">
                        {TitleNullTest(title)}
                    </div>
                    <div className="flex items-center">

                        {customButtons.map((button,i) =>
                            <React.Fragment key={i}>

                                    <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                        <Button variant="contained" size="small" color="primary" className={classes.button}>
                                            <ArrowRightIcon className={classNames(classes.leftIcon, classes.iconSmall)}/>
                                            {button.label}
                                        </Button>
                                    </FuseAnimate>

                            </React.Fragment>
                        )}

                        {buttons.map((button,i) =>
                            <React.Fragment key={i}>

                                { C_PERMISSION && addState && (button==='add') && (

                                    <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                    <Button variant="contained" size="small" color="secondary" className={classes.button}
                                            onClick={() => {
                                                this.props.callFunction('add',(R) => {
                                                    //console.log(R);
                                                    this.setState({
                                                        addState:false,
                                                        saveState:true
                                                    });
                                                });
                                            }}
                                    >
                                    <AddIcon className={classNames(classes.leftIcon, classes.iconSmall)}/>
                                    신규등록
                                    </Button>
                                    </FuseAnimate>
                                )}

                                { C_PERMISSION && copyState && (button==='copy') && (

                                    <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                    <Button variant="contained" size="small" color="secondary" className={classes.button}
                                            onClick={() => {
                                                this.props.callFunction('copy',(R) => {
                                                    this.setState({
                                                        addState:false,
                                                        copyState:false,
                                                        saveState:true
                                                    });
                                                });
                                            }}
                                    >
                                    <AddIcon className={classNames(classes.leftIcon, classes.iconSmall)}/>
                                    복사등록
                                    </Button>
                                    </FuseAnimate>
                                )}

                                { saveState && (button==='save') && (
                                    <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                        <Button variant="contained" size="small" color="secondary" className={classes.button}
                                                onClick={() => {
                                                    this.props.callFunction('save',(R) => {
                                                        //console.log(R);
                                                        this.setState({
                                                            addState:true,
                                                            saveState:false,
                                                            deleteState:false,
                                                            copyState:false
                                                        });
                                                    });
                                                }}
                                        >
                                            <SaveIcon className={classNames(classes.leftIcon, classes.iconSmall)}/>
                                            저&nbsp;&nbsp;&nbsp;&nbsp;장
                                        </Button>
                                    </FuseAnimate>
                                )}

                                { U_PERMISSION && updateState && (button==='update') && (
                                    <React.Fragment>
                                        <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                            <Button variant="contained" size="small" color="secondary" className={classes.button}
                                                onClick={()=>{
                                                    this.props.callFunction('update',(R) => {
                                                        console.log(R);
                                                        this.setState({
                                                            addState:false,
                                                            saveState:true,
                                                            deleteState:false,
                                                            copyState:false,
                                                            updateState:false
                                                        });
                                                    });
                                                }}
                                            >
                                                수&nbsp;&nbsp;&nbsp;&nbsp;정
                                            </Button>

                                        </FuseAnimate>
                                    </React.Fragment>
                                )}

                                { D_PERMISSION && deleteState && (button==='delete') && (
                                    <React.Fragment>
                                        <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                            <Button variant="contained" size="small" color="secondary" className={classes.button}
                                                    onClick={()=>{

                                                        this.setState({buttonDelete:true});
                                                    }}
                                            >
                                                <RemoveIcon className={classNames(classes.leftIcon, classes.iconSmall)}/>
                                                삭&nbsp;&nbsp;&nbsp;&nbsp;제
                                            </Button>
                                        </FuseAnimate>
                                        <OwpDialog
                                            onOpen={this.state.buttonDelete}
                                            dialogActions={
                                                <React.Fragment>
                                                    <Button color="secondary"
                                                            onClick={() => {
                                                                //console.log('onDelete');
                                                                this.setState({buttonDelete:this.props.callFunction('delete')});
                                                                //this.props.callFunction();
                                                            }}
                                                    >
                                                        예
                                                    </Button>
                                                    <Button color="primary"
                                                            onClick={()=>{
                                                                this.setState({buttonDelete:false});
                                                            }}
                                                    >
                                                        아니요
                                                    </Button>
                                                </React.Fragment>
                                            }innerRef={ ref=> this.owpDialog = ref}
                                        >
                                            <React.Fragment>
                                                선택한 행을 삭제하시겠습니까?
                                            </React.Fragment>
                                        </OwpDialog>
                                    </React.Fragment>
                                )}

                                {(button==='excel') && (
                                    <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                        <Button variant="contained" size="small" color="secondary" className={classes.button}
                                                onClick={() => {
                                                    if (typeof this.props.callFunction ==='function') {
                                                        this.props.callFunction('excel',(R) => {
                                                            //console.log(R);
                                                            // this.setState({
                                                            //                                                         //     addState:true,
                                                            //                                                         //     saveState:false,
                                                            //                                                         //     deleteState:false,
                                                            //                                                         //     copyState:false
                                                            //                                                         // });
                                                        });
                                                    }
                                                }}
                                        >
                                            <SaveAltIcon className={classNames(classes.leftIcon, classes.iconSmall)}/>
                                            엑셀저장
                                        </Button>
                                    </FuseAnimate>
                                )}

                                {(button==='excel2') && (
                                    <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                        <Button variant="contained" size="small" color="secondary" className={classes.button}
                                                onClick={() => {
                                                    if (typeof this.props.callFunction ==='function') {
                                                        this.props.callFunction('excel',(R) => {
                                                            //console.log(R);
                                                            // this.setState({
                                                            //                                                         //     addState:true,
                                                            //                                                         //     saveState:false,
                                                            //                                                         //     deleteState:false,
                                                            //                                                         //     copyState:false
                                                            //                                                         // });
                                                        });
                                                    }
                                                }}
                                        >
                                            엑셀저장
                                        </Button>
                                    </FuseAnimate>
                                )}

                                {(button==='pdf') && (
                                    <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                        <Button variant="contained" size="small" color="secondary" className={classes.button}
                                                onClick={() => {
                                                    this.props.callFunction('pdf',(R) => {

                                                    });
                                                }}
                                        >
                                            <SaveAltIcon className={classNames(classes.leftIcon, classes.iconSmall)}/>
                                            PDF저장
                                        </Button>
                                    </FuseAnimate>
                                )}

                                {(button==='cancel') && (
                                    <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                        <Button variant="contained" size="small" color="primary" className={classes.button}>
                                            취&nbsp;&nbsp;&nbsp;&nbsp;소
                                        </Button>
                                    </FuseAnimate>
                                )}

                                {(button==='finished') && (
                                    <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                        <Button variant="contained" size="small" color="primary" className={classes.button}>
                                            완&nbsp;&nbsp;&nbsp;&nbsp;료
                                        </Button>
                                    </FuseAnimate>
                                )}

                                {(button==='list') && (
                                    <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                        <Button variant="contained" size="small" color="default" className={classes.button}>
                                            목&nbsp;&nbsp;&nbsp;&nbsp;록
                                        </Button>
                                    </FuseAnimate>
                                )}


                                {(button==='fix') && (
                                    <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                        <Button variant="contained" size="small" color="default" className={classes.button}>
                                            고정
                                        </Button>
                                    </FuseAnimate>
                                )}

                                {(button==='view') && (
                                    <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                        <Button variant="contained" size="small" color="secondary" className={classes.button}>
                                            보&nbsp;&nbsp;&nbsp;&nbsp;기
                                        </Button>
                                    </FuseAnimate>
                                )}

                                {(button==='print') && (
                                    <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                        <Button variant="contained" size="small" color="secondary" className={classes.button}>
                                            <PrintIcon className={classNames(classes.leftIcon, classes.iconSmall)}/>
                                            목록출력
                                        </Button>
                                    </FuseAnimate>
                                )}

                                {(button==='renew') && (
                                    <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                        <Button variant="contained" size="small" color="default" className={classes.button}>
                                            초기화
                                        </Button>
                                    </FuseAnimate>
                                )}


                                {(button==='search') && (
                                    <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                        <Button variant="contained" size="small" color="secondary" className={classes.button}>
                                            조회
                                        </Button>
                                    </FuseAnimate>
                                )}


                                {(button==='listitem') && (
                                    <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                        <select className="sc_seclect_m2" >
                                            <option value="select">조회항목</option>
                                            <option>조회항목1</option>
                                            <option>조회항목2</option>
                                            <option>조회항목3</option>
                                        </select>
                                    </FuseAnimate>
                                )}

                                {(button==='listslect') && (
                                    <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                        <select className="sc_seclect_m2" >
                                            <option value="select">항목선택</option>
                                            <option>항목선택1</option>
                                            <option>항목선택2</option>
                                            <option>항목선택3</option>
                                        </select>
                                    </FuseAnimate>
                                )}

                                {(button==='listcontent') && (
                                    <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                        <select className="sc_seclect_m2" >
                                            <option value="select">조회</option>
                                            <option>조회내용1</option>
                                            <option>조회내용2</option>
                                            <option>조회내용3</option>
                                        </select>
                                    </FuseAnimate>
                                )}
                                {(button==='process') && (
                                    <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                        <select className="sc_seclect_m2 ">
                                            <option>공정1</option>
                                            <option>공정2</option>
                                            <option>공정3</option>
                                        </select>
                                    </FuseAnimate>
                                )}
                                {(button==='period') && (
                                    <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                        <div className="btn-group" data-toggle="buttons">
                                            <label className="btn btn-default btn-outline btn-sm"><input type="radio" className="toggle" /> 당일 </label>
                                            <label className="btn btn-default btn-outline btn-sm"><input type="radio" className="toggle" /> 1주일 </label>
                                            <label className="btn btn-default btn-outline btn-sm"><input type="radio" className="toggle" /> 1개월 </label>
                                        </div>
                                    </FuseAnimate>
                                )}

                                {(button==='risoa') && (
                                    <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                        <div className="btn-group" data-toggle="buttons">
                                            <span className="cl01 mgl10">●</span> RUN
                                            <span className="cl02 mgl10">●</span> IDLE
                                            <span className="cl03 mgl10">●</span> STOP
                                            <span className="cl04 mgl10">●</span> OFF
                                            <span className="cl05 mgl10">●</span> ALARM
                                        </div>
                                    </FuseAnimate>
                                )}

                                {(button==='term') && (
                                    <div className="btn-group" data-toggle="buttons">
                                        <label className="btn btn-default btn-outline btn-sm"><input type="radio" className="toggle" /> 당일 </label>
                                        <label className="btn btn-default btn-outline btn-sm"><input type="radio" className="toggle" /> 1주일 </label>
                                        <label className="btn btn-default btn-outline btn-sm"><input type="radio" className="toggle" /> 1개월 </label>
                                    </div>
                                )}

                                {(button==='mom') && (
                                    <div className="btn-group" data-toggle="buttons">
                                        <Button variant="contained" size="medium" color="secondary" className={classes.button}>
                                            설비/속성 선택
                                        </Button>
                                        <Button variant="contained" size="medium" color="secondary" className={classes.button}>
                                            모니터링 설정
                                        </Button>
                                    </div>
                                )}

                                {(button==='line_ins') && (
                                    <div className="btn-group" data-toggle="buttons">
                                        <Button variant="contained" size="small" color="secondary" className={classes.button} onClick={this.openDialogReweighing}>
                                            등록
                                        </Button>
                                    </div>
                                )}

                                {(button==='sav') && (
                                    <div className="btn-group" data-toggle="buttons">
                                        <Button variant="contained" size="small" color="secondary" className={classes.button} onClick={() => {
                                                    if (typeof this.props.callFunction ==='function') {
                                                        this.props.callFunction('sav',() => {
                                                        });
                                                    }
                                                }}>
                                            저장
                                        </Button>
                                    </div>
                                )}

                                {(button==='mod') && (
                                    <div className="btn-group" data-toggle="buttons">
                                        <Button variant="contained" size="small" color="secondary" className={classes.button}>
                                            수정
                                        </Button>
                                    </div>
                                )}

                                {(button==='del') && (
                                    <div className="btn-group" data-toggle="buttons">
                                        <Button variant="contained" size="small" color="secondary" className={classes.button}>
                                            삭제
                                        </Button>
                                    </div>
                                )}
                                {(button==='imp') && (
                                    <div className="btn-group" data-toggle="buttons">
                                        <Button variant="contained" size="small" color="secondary" className={classes.button}>
                                            불러오기
                                        </Button>
                                    </div>
                                )}
                                {(button==='serc') && (
                                    <div className="btn-group" data-toggle="buttons">
                                        <Button variant="contained" size="small" color="secondary" className={classes.button}>
                                            분석 설정
                                        </Button>
                                    </div>
                                )}
                                {(button==='otset') && (
                                    <div className="btn-group" data-toggle="buttons">
                                        <Button variant="contained" size="small" color="secondary" className={classes.button}>
                                            옵션 설정
                                        </Button>
                                    </div>
                                )}
                                {(button==='10view') && (
                                    <div className="btn-group" data-toggle="buttons">
                                        <Button variant="contained" size="small" color="secondary" className={classes.button}>
                                            10개씩 보기
                                        </Button>
                                    </div>
                                )}


                            </React.Fragment>
                        )}
                        {this.props.children}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

OwpToolbar.propTypes = propTypes;
OwpToolbar.defaultProps = defaultProps;

export default withStyles(styles, {withTheme: true})(OwpToolbar);

