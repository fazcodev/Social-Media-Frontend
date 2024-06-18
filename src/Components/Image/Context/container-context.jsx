import {useState, createContext} from 'react'

const ContainerContext = createContext({
    menuIdx: 0,
    setMenuIdx: () => {},
    isImageUploaded: false,
    setIsImageUploaded: () => {},
    uploadingPost: 0,
    setUploadingPost: () => {}, 
    
});

const ContainerCtxProvider = (props) => {
    const [menuIdx, setMenuIdx] = useState(0);
    const [isImageUploaded, setIsImageUploaded] = useState(false);
    const [uploadingPost, setUploadingPost] = useState(0);

    return (
        <ContainerContext.Provider value={{
            menuIdx: menuIdx,
            setMenuIdx: setMenuIdx,
            isImageUploaded: isImageUploaded,
            setIsImageUploaded: setIsImageUploaded,
            uploadingPost: uploadingPost,
            setUploadingPost: setUploadingPost,
        }}>
            {props.children}
        </ContainerContext.Provider>
    );
}

export {ContainerContext, ContainerCtxProvider};






