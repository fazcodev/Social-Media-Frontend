import {configureStore} from '@reduxjs/toolkit'
import { captionReducer, cropModeReducer, editModeReducer } from './ImageEditor'
import { authReducer } from './Auth'

const store = configureStore({
    reducer: {cropMode: cropModeReducer, editMode: editModeReducer, caption: captionReducer, auth: authReducer}
})


export default store