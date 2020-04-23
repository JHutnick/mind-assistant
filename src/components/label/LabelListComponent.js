import React from 'react';
import LabelComponent from './LabelComponent';
import '../../App.css';
import {findCurrentUser} from "../../actions/userActions";
import {connect} from "react-redux";
import userService from "../../services/userService";
import labelService from "../../services/labelService";
import {createLabel, deleteLabel, findLabelsForGroup, updateLabel} from "../../actions/labelActions";
import noteService from "../../services/noteService";
import {findNotesForGroup} from "../../actions/noteActions";

const UserService = new userService();
const LabelService = new labelService();
const NoteService = new noteService();

class LabelListComponent extends React.Component {
    state = {
        user: {id: 0},
        folderId: 0,
        newTitle: "New Label",
        activeLabel: "",
        editingId: "",
        editTitle: "",
        status: ""
    };

    componentDidMount() {
        this.props.findCurrentUser();
        if(this.props.folderId > 0){
            this.props.findLabelsForFolder(this.props.folderId);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(!this.props.folderId > 0 && this.state.user.id === 0 && this.props.user.id > 0){
            this.setState({
                user: this.props.user
            });
            this.props.findLabelsForUser(this.props.user.id);
        }
    }

    selectLabel = (labelId) => {
        const folderId = this.props.folderId;
        if(labelId === this.state.activeLabel){
            if(folderId > 0){
                this.props.findNotesForFolder(folderId);
                this.props.history.push(`/folder/${folderId}`);
            } else {
                this.props.findNotesForUser(this.state.user.id);
                this.props.history.push(`/`);
            }
            this.setState({
                activeLabel: ""
            });
        } else {
            if(folderId > 0){
                this.props.history.push(`/folder/${folderId}/label/${labelId}`);
            } else {
                this.props.history.push(`/label/${labelId}`);
            }
            this.setState({
                activeLabel: labelId
            });
        }
    };

    newTitle = (e) => {
        this.setState({
            newTitle: e.target.value
        })
    };

    editTitle = (e) => {
        this.setState({
            editTitle: e.target.value
        })
    };

    editStatus = (e) => {
        this.setState({
            status: e.target.value
        })
    };

    editLabel = (label) => {
        this.setState({
            editingId: label.id,
            editTitle: label.title,
            status: label.status
        })
    };

    cancelEdit = () => {
        this.setState({
            editingId: "",
            editTitle: "",
            status: ""
        })
    };

    createLabel = () => {
        const folderId = this.props.folderId;
        if(folderId > 0){
            this.props.createLabelForFolder(folderId, {title: this.state.newTitle})
        } else {
            this.props.createLabelForUser(this.props.user.id, {title: this.state.newTitle});
        }
        this.setState({
            newTitle: "New Label"
        })
    };

    deleteLabel = (labelId) => {
        this.props.deleteLabel(labelId)
    };

    updateLabel = (labelId) => {
        const label = {id: labelId, title: this.state.editTitle, status: this.state.status};
        this.props.updateLabel(labelId, label);
        this.setState({
            editingId: "",
            editTitle: "",
            status: ""
        })
    };

    render() {
        return (
            <div>
                <ul className="list-group">
                    {this.props.labels.length > 0 && this.props.labels.map(label =>
                        <div key={label.id}>
                            <LabelComponent
                                label={label}
                                active={label.id === this.state.activeLabel}
                                select={this.selectLabel}
                                editing={label.id === this.state.editingId}
                                edit={this.editLabel}
                                editTitle={this.editTitle}
                                newTitle={this.state.editTitle}
                                editStatus={this.editStatus}
                                newStatus={this.state.status}
                                cancel={this.cancelEdit}
                                save={this.updateLabel}
                                deleteLabel={this.deleteLabel}
                            />
                        </div>
                    )}
                </ul>
                <br/>
                <div>
                    <input
                        type={"text"}
                        onChange={this.newTitle}
                        className="form-control"
                        placeholder={"New Label"}
                        value={this.state.newTitle}
                    />
                    <button onClick={this.createLabel}
                            className="btn btn-primary btn-block">
                        Add Label
                    </button>
                </div>
            </div>
        )
    }
}

const stateToPropertyMapper = (state) => ({
    user: state.user.user,
    labels: state.labels.labels,
    notes: state.notes.notes
});
const dispatchToPropertyMapper = (dispatch) => ({
    findCurrentUser: () => {
        UserService.findCurrentUser().then(user => {
            dispatch(findCurrentUser(user))
        })
    },
    findLabelsForUser: (userId) => {
        LabelService.findLabelsForUser(userId).then(labels => {
            dispatch(findLabelsForGroup(labels))
        })
    },
    createLabelForUser: (userId, label) => {
        LabelService.createLabelForUser(userId, label).then(label => {
            dispatch(createLabel(label))
        })
    },
    findLabelsForFolder: (folderId) => {
        LabelService.findLabelsForFolder(folderId).then(labels => {
            dispatch(findLabelsForGroup(labels))
        })
    },
    createLabelForFolder: (folderId, label) => {
        LabelService.createLabelForFolder(folderId, label).then(label => {
            dispatch(createLabel(label))
        })
    },
    deleteLabel: (labelId) => {
        LabelService.deleteLabel(labelId).then(status => {
            dispatch(deleteLabel(labelId))
        })
    },
    updateLabel: (labelId, label) => {
        LabelService.updateLabel(labelId, label).then(status => {
            dispatch(updateLabel(labelId, label))
        })
    },
    findNotesForUser: (userId) => {
        NoteService.findNotesForUser(userId).then(notes => {
            dispatch(findNotesForGroup(notes))
        })
    },
    findNotesForFolder: (folderId) => {
        NoteService.findNotesForFolder(folderId).then(notes => {
            dispatch(findNotesForGroup(notes))
        })
    }
});
export default connect(
    stateToPropertyMapper,
    dispatchToPropertyMapper
)(LabelListComponent)
