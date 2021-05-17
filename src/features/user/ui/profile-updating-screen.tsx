import React, { ChangeEvent, useCallback, useState } from "react";
import { ProfilePhotoPicker } from "./components/profile-photo-picker";
import { PhotoCropper } from "./components/photo-cropper";
import {
  Button,
  CircularProgress,
  createStyles,
  Icon,
  IconButton,
  makeStyles,
  TextField,
} from "@material-ui/core";
import { FullScreenDialog } from "./components/fullscreen-dialog";
import AlertDialog from "../../../shared/components/alert-dialog";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import UserError from "../types/user-error";
import {
  centeredLayout,
  nonSelectable,
  wrapper,
} from "../../../shared/styles/shared";
import {
  ErrorSnackbar,
  SuccessSnackbar,
} from "../../../shared/components/snackbars";
import { useAuthActions } from "../../auth/auth-actions-context";
import { useMeActions } from "../me-actions-context";
import { useFileUtils } from "../../../shared/utils/file-utils";
import { useAppDispatch, useAppSelector } from "../../../core/redux/hooks";
import { UserUpdate } from "../types/user";
import BackButton from "../../../shared/components/back-button";
import { shallowEqual } from "react-redux";

const validators = {
  validateUsername(username: string) {
    if (username.length === 0) return `A username is required`;
    if (username[0] === "." || username[username.length - 1] === ".")
      return `The username can't start or end with a dot`;
    if (/\.{2,}/.test(username))
      return `The username can't have 2 consecutive dots`;
    if (username.length < 4) return `Username must be 4 characters at least`;
    if (username.length > 20) return `Username must be 20 characters at most`;
    if (!/^[a-z0-9._]+$/.test(username))
      return "Username can only contain letter, numbers, . and _";
  },

  validateName(name: string) {
    if (name.length > 20) return "Name must be 20 characters at most";
  },
};

export type ProfileUpdatingScreenProps = {
  registering?: boolean;
  initialUsername?: string;
  initialName?: string;
  initialPhotoURL?: string;
};

export const ProfileUpdatingScreen: React.FC<ProfileUpdatingScreenProps> = ({
  registering,
  initialUsername,
  initialName,
  initialPhotoURL,
}) => {
  const defaultSrc = "/images/default-pp.png";

  // Local state
  // Current chosen profile photo
  const [src, setSrc] = useState(initialPhotoURL);

  // Photo being cropped
  const [cropSrc, setCropSrc] = useState<string>();

  // Set this to true to open the photo cropper fullscreen dialog
  const [cropping, setCropping] = useState(false);

  // Chosen username
  const [username, setUsername] = useState(initialUsername ?? "");

  // Chosen username error (could be invalid or taken)
  const [usernameError, setUsernameError] = useState<string>();

  // Chosen name
  const [name, setName] = useState(initialName ?? "");

  // Chosen name error
  const [nameError, setNameError] = useState<string>();

  // Ste to true to show the logout alert dialog
  const [logginOut, setLogginOut] = useState(false);
  const [success, setSuccess] = useState(0);

  // Redux hooks to
  const state = useAppSelector((state) => state.me);
  const dispatch = useAppDispatch();
  const { signOut } = useAuthActions();
  const { createMe, updateMe } = useMeActions();

  // Photo utils
  const photoUtils = useFileUtils();

  const stringifyError = useCallback((e: UserError | null) => {
    switch (e) {
      case UserError.network:
        return "Check your internet connection";

      default:
        return "Something weird happened";
    }
  }, []);

  // Return true if there is a uername error (used in the username textfield).
  const hasUsernameError = () => {
    return (
      usernameError !== undefined || state.error === UserError.usernameTaken
    );
  };

  // Return the string representation of the error displayed in the username TextField
  const getUsernameError = () => {
    if (usernameError) return usernameError;

    if (state.error === UserError.usernameTaken)
      return "This username is taken";
  };

  // Call this to hsow the photo cropper with photo passed as a parameter
  const cropPhoto = (newCropSrc: string) => {
    setCropSrc(undefined);
    setCropSrc(newCropSrc);
    setCropping(true);
  };

  // Called by the ProfilePhotoPicker component when the user selects a photo
  const photoPickerd = useCallback(async (photo: File) => {
    const newCropSrc = await photoUtils.fileToURL(photo);
    cropPhoto(newCropSrc);
  }, []);

  // Called by the ProfilePhotoPicker component when the user removes the selected photo
  const photoRemoved = useCallback(() => {
    setSrc(undefined);
  }, []);

  // Called by the photo cropper with photo passed as a parameter
  const cancelCroppping = useCallback(() => {
    setCropping(false);
  }, []);

  // Called by the photo cropper with the cropped photo
  const photoCropped = useCallback((photo: string | null) => {
    setCropping(false);
    if (photo) setSrc(photo);
  }, []);

  // onChange for the username TextField
  const usernameChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value.toLowerCase();
    setUsername(username);
  }, []);

  // Show alert dialog when the user clicks the logout button
  const askForLogoutConfirmation = useCallback(() => {
    setLogginOut(false);
    dispatch(signOut());
  }, []);

  // Called when the user cancels the logout from the alert dialog
  const logoutCanceled = useCallback(() => {
    setLogginOut(false);
  }, []);

  return <h1>profile updating</h1>;
};
