import React from 'react';
import NoteComponent from './NoteComponent';
import '../../App.css';
import {findCurrentUser} from "../../actions/userActions";
import {createNote, deleteNote, findNotesForGroup, updateNote} from "../../actions/noteActions";
import {connect} from "react-redux";
import userService from "../../services/userService";
import noteService from "../../services/noteService";
import labelService from "../../services/labelService";
import NewNoteComponent from "./NewNoteComponent";

const UserService = new userService();
const NoteService = new noteService();
const LabelService = new labelService();

class NoteListComponent extends React.Component {
    state = {
        editingNoteId: '',
        user: {id: 0},
        newLabels: [],
        curLabels: []
    };

    componentDidMount() {
        this.props.findCurrentUser();
        if(this.props.folderId > 0){
            this.props.findNotesForFolder(this.props.folderId);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(!this.props.folderId > 0 && this.state.user.id === 0 && this.props.user.id >0){
            this.setState({
                user: this.props.user
            });
            this.props.findNotesForUser(this.props.user.id)
        }
        if(this.props.labelId !== prevProps.labelId){
            this.props.findNotesForLabel(this.props.labelId)
        }
    }

    createNote= (note) => {
        const folderId = this.props.folderId;
        if(folderId > 0){
            this.props.createNoteForFolder(folderId, note);
        } else {
            this.props.createNoteForUser(this.props.user.id, note);
        }
    };

    deleteNote = (id) => {
        this.props.deleteNote(id)
    };

    saveNote = (note) => {
        this.setState({
            editing: ''
        });
        this.props.updateNote(note.id,note)
    };


    cancelEdit = () => {
        this.setState({
                          editingId: "",

                      })
    };

    render() {
        return (
            <ul className="list-group">
                <li className="list-group-item">
                    <NewNoteComponent
                        createNote={this.createNote}
                        folderId={this.props.folderId}
                        labelId={this.props.labelId}
                    />
                </li>
                <br/>
                {this.props.notes.length >0 && this.props.notes.map(note =>
                    <div key={note.id}>
                        <NoteComponent
                            updateLabels={this.updateLabels}
                            curLabels={this.state.curLabels}
                            newLabels={this.state.newLabels}
                            cancel={this.cancelEdit}
                            editing={note.id === this.state.editingNoteId}
                            deleteNote={this.deleteNote}
                            saveNote={this.saveNote}
                            cur
                            note={note}
                            folderId={this.props.folderId}
                            labelId={this.props.labelId}
                        />
                        <br/>
                    </div>
                )}
            </ul>
        )
    }
}

const stateToPropertyMapper = (state) => ({
    user: state.user.user,
    notes: state.notes.notes,
    labels: state.labels.labels
});
const dispatchToPropertyMapper = (dispatch) => ({
    findCurrentUser: () => {
        UserService.findCurrentUser().then(user => {
            dispatch(findCurrentUser(user))
        })
    },
    findNotesForUser: (userId) => {
        NoteService.findNotesForUser(userId).then(notes => {
            dispatch(findNotesForGroup(notes))
        })
    },
    createNoteForUser: (userId, note) => {
        NoteService.createNoteForUser(userId,note).then(note => {
            dispatch(createNote(note))
        })
    },
    findNotesForFolder: (folderId) => {
        NoteService.findNotesForFolder(folderId).then(notes => {
            dispatch(findNotesForGroup(notes))
        })
    },
    findNotesForLabel: (labelId) => {
        LabelService.findNotesForLabel(labelId).then(notes => {
            dispatch(findNotesForGroup(notes))
        })
    },
    createNoteForFolder: (folderId, note) => {
        NoteService.createNoteForFolder(folderId,note).then(note => {
            dispatch(createNote(note))
        })
    },
    deleteNote: (noteId) => {
        NoteService.deleteNote(noteId).then(status => {
            dispatch(deleteNote(noteId))
        })
    },
    updateNote: (noteId, note) => {
        NoteService.updateNote(noteId,note).then(status => {
            dispatch(updateNote(noteId,note))
        })
    }
});
export default connect(
    stateToPropertyMapper,
    dispatchToPropertyMapper
)(NoteListComponent)
