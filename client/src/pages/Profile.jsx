import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserFailed,
  updateUserStart,
  updateUserSucess,
  deleteUserFailed,
  deleteUserStart,
  deleteUserSucess,
} from "../redux/user/userSlice";

const Profile = () => {
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [filePercent, setFilePercent] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setformData] = useState({});
  const [updatestatus, setupdatestatus] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      // Corrected condition, it should execute handleFileUpload if file exists
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file?.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercent(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setformData({ ...formData, avatar: downloadUrl });
        });
      }
    );
  };

  const handleChange = (e) => {
    setformData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailed(data.message));
        return;
      }

      dispatch(updateUserSucess(data));
      setupdatestatus(true);
    } catch (error) {
      dispatch(updateUserFailed(error.message));
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = res.json();
      if (data.success === false) {
        dispatch(deleteUserFailed(data.message));
        return;
      }
      dispatch(deleteUserSucess());
    } catch (error) {
      dispatch(deleteUserFailed(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => {
            fileRef.current.click();
          }}
          src={formData.avatar || currentUser.avatar}
          alt="profile pic"
          className="rounded-full self-center h-24 w-24 object-cover cursor-pointer mt-2 mb-3"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">Error while uploading image</span>
          ) : filePercent > 0 && filePercent < 100 ? (
            <span className="text-green-600">{`Uploading ${filePercent}...`}</span>
          ) : filePercent === 100 ? (
            <span className="text-green-600">Uploaded successfully!</span>
          ) : (
            ""
          )}
        </p>

        <input
          type="text"
          id="username"
          placeholder="username"
          className="border m-2 p-3 rounded-lg"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="email"
          id="email"
          placeholder="email"
          className="border m-2 p-3 rounded-lg"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          placeholder="password"
          className="border m-2 p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-black text-white rounded-lg m-2 p-3 hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading.." : "Update"}
        </button>
      </form>
      <div className="flex justify-between m-2">
        <span onClick={handleDelete} className="text-red-700 cursor-pointer">
          Delete account
        </span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
      <p className="text-red-700 m-2">{error ? error : ""}</p>
      <p className="text-green-600 m-2">
        {updatestatus ? "User updated successfully!" : ""}
      </p>
    </div>
  );
};

export default Profile;
