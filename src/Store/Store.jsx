import { configureStore } from '@reduxjs/toolkit'
import { captionReducer, cropModeReducer, editModeReducer } from './ImageEditor'
import { authReducer } from './Auth'
import { themeReducer } from './Theme'

const store = configureStore({
    reducer: { cropMode: cropModeReducer, editMode: editModeReducer, caption: captionReducer, auth: authReducer, theme: themeReducer }
})


export default store