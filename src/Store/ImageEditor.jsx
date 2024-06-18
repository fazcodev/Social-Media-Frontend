import { createSlice } from "@reduxjs/toolkit";

const cropModeSlice = createSlice({
    name: 'cropMode',
    initialState: {
        crop: {x: 0, y: 0},
        croppedPixels: null,
        croppedImage: null,
        rotation: 0,
        zoom: 1.5,
    },
    reducers:{
        setCrop(state, action){
            state.crop = action.payload
        },
        setZoom(state, action){
            state.zoom = action.payload
        },
        setRotation(state, action){
            state.rotation = action.payload
        },
        setCroppedPixels(state, action){
            state.croppedPixels = action.payload
        },
        setCroppedImage(state, action){
            state.croppedImage = action.payload
        }

    }
})

const editModeSlice = createSlice({
    name: 'editMode',
    initialState: {
        editedImage: null
    },
    reducers:{
        setEditedImage(state, action){
            state.editedImage = action.payload
        }
    }
})

const captionSlice = createSlice({
    name: 'caption',
    initialState: {
        caption: ''
    },
    reducers:{
        setCaption(state, action){
            state.caption = action.payload
        }
    }
})


export const cropModeReducer = cropModeSlice.reducer
export const cropModeActions = cropModeSlice.actions
export const editModeReducer = editModeSlice.reducer
export const editModeActions = editModeSlice.actions
export const captionReducer = captionSlice.reducer
export const captionActions = captionSlice.actions