import React, { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import { useSelector } from "react-redux";
import {useNavigate, useParams} from 'react-router-dom';

const UpdateListing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const params = useParams();
  const [formData, setformData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    beds: 1,
    baths: 1,
    regularPrice: 0,
    discountedPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setimageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, seterror] = useState(false);  
  

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/getListing/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        // console.log(data.message);
        return;
      }
      setformData(data);
    };

    fetchListing();
  }, []);

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
          // console.log(`Upload is ${progress}% done`);
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
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setformData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setformData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setformData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {    
    e.preventDefault();
    setLoading(true);
    seterror(false);

    try {
      if(formData.imageUrls.length < 1){
        setLoading(false);
        return seterror('You must upload at least one Image');
      }
      if(+formData.regularPrice < +formData.discountedPrice){
        setLoading(false);
        return seterror('Discounted Price must be less than Regular Price');
      }
      const res = await fetch(`/api/listing/updatelisting/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, useRef: currentUser._id }),
      });

      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        seterror(data.message);
      }
      navigate(`/listing/${params.listingId}`);
    } catch (error) {
      seterror(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-6">
        Update a Listing
      </h1>

      <form action="" className="flex flex-col sm:flex-row">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            id="name"
            placeholder="Title"
            className="border rounded-lg p-3"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            id="description"
            cols={50}
            rows={3}
            placeholder="Description"
            className="border rounded-lg p-3"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            id="address"
            placeholder="Address"
            className="border rounded-lg p-3"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex flex-row gap-6 flex-wrap flex-1">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
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
                onChange={handleChange}
                value={formData.beds}
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
                onChange={handleChange}
                value={formData.baths}
              />
              <p>Baths</p>
            </div>
            <div className="flex gap-3 items-center">
              <input
                type="number"
                id="regularPrice"
                required
                className="p-2 border border-gray-400 rounded-lg w-14"
                onChange={handleChange}
                value={formData.regularPrice}
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
                onChange={handleChange}
                value={formData.discountedPrice}
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
            formData.imageUrls.map((url, index) => (
              <div key={url} className="flex justify-between p-3 items-center">
                <img
                  src={url}
                  alt="Listing image"
                  className="rounded-md w-20 h-20 object-contain"
                />
                <button
                  onClick={() => handleDeleteButton(index)}
                  type="button"
                  className="border border-red-500 bg-red-600 text-white p-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            ))}
          <button disabled={loading || uploading} onClick={handleSubmit} className="rounded-lg bg-slate-700 p-3 text-white mt-5">
            {loading ? "Updating..." : "Update Listing"}
          </button>
          {error && <p className="text-red-600 text-sm">Check the details properly!! Conditions not met!!!</p>}
        </div>
      </form>
    </main>
  );
};

export default UpdateListing;
