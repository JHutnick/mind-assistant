import {
    CREATE_NOTE,
    DELETE_NOTE, FIND_ALL_NOTES,
    FIND_NOTE_BY_ID,
    FIND_NOTES_FOR_GROUP, SEARCH_NOTES,
    UPDATE_NOTE
} from "../actions/noteActions";

const noteReducer = (state={notes:[]}, action) => {
    switch (action.type) {
        case FIND_NOTES_FOR_GROUP:
            return {
                notes: action.notes
            };
        case CREATE_NOTE:
            return {
                notes: [
                    ...state.notes,
                    action.note
                ]
            };
        case UPDATE_NOTE:
            return {
                notes: state.notes.map(note =>
                    note.id === action.noteId ? action.note : note
                )
            };
        case DELETE_NOTE:
            return {
                notes: state.notes.filter(note => note.id !== action.noteId)
            };
        case SEARCH_NOTES:
            return {
                notes: action.notes.filter(note => note.status === "public")
            };
        case FIND_ALL_NOTES:
            return {
                notes: action.notes
            };
        case FIND_NOTE_BY_ID:
            return {
                notes: action.note
            };
        default:
            return state
    }
};

export default noteReducer