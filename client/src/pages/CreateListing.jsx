import React, { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";

const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const [formData, setformData] = useState({
    imageUrls: [],
  });
  const [imageUploadError, setimageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  console.log(formData);

  const handleImageSubmit = async (e) => {
    if (files.length > 0 && files.length < 7) {
      setUploading(true);
      setimageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setformData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setimageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setimageUploadError("Upload image failed!! Max 2MB allowed!!");
          setUploading(false);
        });
    } else {
      setimageUploadError("You can upload 6 images at max");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },

        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          });
        }
      );
    });
  };

  const handleDeleteButton = (index) => {
    setformData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    })
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-6">
        Create a Listing
      </h1>

      <form action="" className="flex flex-col sm:flex-row">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            id="name"
            placeholder="Title"
            className="border rounded-lg p-3"
            required
          />
          <textarea
            type="text"
            id="description"
            cols={50}
            rows={3}
            placeholder="Description"
            className="border rounded-lg p-3"
            required
          />
          <input
            type="text"
            id=""
            placeholder="Address"
            className="border rounded-lg p-3"
            required
          />
          <div className="flex flex-row gap-6 flex-wrap flex-1">
            <div className="flex gap-2">
              <input type="checkbox" id="sell" className="w-5" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-4 flex-wrap">
            <div className="flex gap-3 items-center">
              <input
                type="number"
                id="beds"
                min={1}
                max={10}
                required
                className="p-2 border border-gray-400 rounded-lg w-14"
              />
              <p>Beds</p>
            </div>
            <div className="flex gap-3 items-center">
              <input
                type="number"
                id="baths"
                min={1}
                max={10}
                required
                className="p-2 border border-gray-400 rounded-lg w-14"
              />
              <p>Baths</p>
            </div>
            <div className="flex gap-3 items-center">
              <input
                type="number"
                id="regularPrice"
                required
                className="p-2 border border-gray-400 rounded-lg w-14"
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($/month)</span>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <input
                type="number"
                id="discountedPrice"
                required
                className="p-2 border border-gray-400 rounded-lg w-16"
              />
              <div className=" flex flex-col items-center">
                <p>Discounted Price </p>
                <span className="text-xs">($/month)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 ml-5">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max:6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => {
                setFiles(e.target.files);
              }}
              type="file"
              id="images"
              accept="image/*"
              multiple
              className="p-3 border border-gray-300 rounded w-full"
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 font-semibold rounded"
              disabled={uploading}
            >
              {uploading ? "Uploading" : "Upload"}
            </button>
          </div>
          <p className="text-red-600 mt-2">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url,index) => (
              <div key={url} className="flex justify-between p-3 items-center">
                <img
                  src={url}
                  alt="Listing image"
                  className="rounded-md w-20 h-20 object-contain"
                />
                <button
                  onClick={()=>handleDeleteButton(index)}
                  type="button"
                  className="border border-red-500 bg-red-600 text-white p-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            ))}
          <button className="rounded-lg bg-slate-700 p-3 text-white mt-5">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
