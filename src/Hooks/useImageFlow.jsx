import { useContext } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { ContainerContext } from "../Components/Image/Context/container-context";
import { useQueryClient } from "@tanstack/react-query";
import {
    cropModeActions,
    editModeActions,
    captionActions,
} from "../Store/ImageEditor";
import { authActions as authActionsOriginal } from "../Store/Auth";
import { createImageBlob, getCroppedImg, applyFilter, getFilterString } from "../Components/Image/ImageUtils";
import { apiUrl } from "../Config/config";
import { MENU_STEPS, UPLOAD_STATUS, FILTER_VALUES } from "../Components/Image/ImageConstants";

const useImageFlow = (menu, title) => {
    const { caption } = useSelector((state) => state.caption);
    const cropMode = useSelector((state) => state.cropMode);

    const { filterClass, adjustments, editedImage } = useSelector((state) => state.editMode);

    const containerCtx = useContext(ContainerContext);
    const queryClient = useQueryClient();

    const dispatch = useDispatch();

    const handleEditStep = async () => {
        try {
            const croppedImage = await getCroppedImg(
                cropMode.croppedImage,
                cropMode.croppedPixels,
                cropMode.rotation
            );
            dispatch(cropModeActions.setCroppedImage(croppedImage));
            containerCtx.setMenuIdx((menuIdx) => menuIdx + 1);
        } catch (e) {
            console.error(e);
        }
    };

    const handleUploadStep = async () => {
        let finalFilterString = "";

        if (filterClass && FILTER_VALUES[filterClass]) {
            finalFilterString = FILTER_VALUES[filterClass];
        } else {
            finalFilterString = getFilterString(adjustments);
        }

        // Apply filter to generate final URL
        // Note: applyFilter takes (imageSrc, filterString, opacity).
        // adjustments.opacity is correct to pass here (default is 1).
        // The source image is the CROPPED image, not the edited one (which we are creating)
        const editedImgURL = await applyFilter(cropMode.croppedImage, finalFilterString, adjustments.opacity);

        dispatch(editModeActions.setEditedImage(editedImgURL));

        if (title === MENU_STEPS.EDIT_AVATAR) {
            handleShare(editedImgURL);
            return;
        }
        containerCtx.setMenuIdx((menuIdx) => menuIdx + 1);
    };

    const handleShare = async (finalImageURL = editedImage) => {
        containerCtx.setUploadingPost(UPLOAD_STATUS.UPLOADING);
        const formData = new FormData();
        const newImageBlob = await createImageBlob(finalImageURL);

        formData.append("description", caption);
        formData.append("image", newImageBlob, "image.jpeg");

        try {
            const endpoint =
                title !== MENU_STEPS.CREATE_POST
                    ? `${apiUrl}/users/me/avatar`
                    : `${apiUrl}/posts`;

            const res = await axios.post(endpoint, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });

            queryClient.invalidateQueries({
                predicate: (query) => {
                    return (
                        query.queryKey[0] === "profile" &&
                        ["posted", "info"].includes(query.queryKey[2]?.type) &&
                        query.queryKey.includes(localStorage.getItem("username"))
                    );
                },
            });

            containerCtx.setUploadingPost(UPLOAD_STATUS.SUCCESS);
            dispatch(captionActions.setCaption(""));

            if (title === MENU_STEPS.EDIT_AVATAR) {
                localStorage.setItem("avatarURL", res.data.avatarURL);
                dispatch(
                    authActionsOriginal.setAuthData({
                        id: res.data._id,
                        email: res.data.email,
                        name: res.data.name,
                        username: res.data.username,
                        avatarURL: res.data.avatarURL,
                    })
                );
            }
        } catch (e) {
            containerCtx.setUploadingPost(UPLOAD_STATUS.ERROR);
            console.error(e);
        }
        dispatch(editModeActions.setEditedImage(null));
    };

    const handleBack = () => {
        if (menu[containerCtx.menuIdx].title === MENU_STEPS.CROP) {
            containerCtx.setIsImageUploaded(false);
        }
        containerCtx.setMenuIdx((menuIdx) => menuIdx - 1);
    };

    return {
        handleEditStep,
        handleUploadStep,
        handleShare,
        handleBack,
    };
};

export default useImageFlow;
