import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

const Profile = () => {
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const { currentUser } = useSelector((state) => state.user);
  const [filePercent, setFilePercent] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setformData] = useState({});

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

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col">
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
          value={currentUser.username}
        />
        <input
          type="email"
          id="email"
          placeholder="email"
          className="border m-2 p-3 rounded-lg"
          value={currentUser.email}
        />
        <input
          type="password"
          id="password"
          placeholder="password"
          className="border m-2 p-3 rounded-lg"
        />
        <button className="bg-black text-white rounded-lg m-2 p-3 hover:opacity-95 disabled:opacity-80">
          Update
        </button>
      </form>
      <div className="flex justify-between m-2">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
};

export default Profile;
