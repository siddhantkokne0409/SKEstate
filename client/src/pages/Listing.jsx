import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import { Navigation } from "swiper/modules";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import Contact from "../components/Contact";

const Listing = () => {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [contact, setContact] = useState(false);
  // console.log(listing);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/getListing/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);
  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {listing &&
        listing.imageUrls &&
        Array.isArray(listing.imageUrls) &&
        !loading &&
        !error && (
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url} style={{ width: "100%" }}>
                {" "}
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                    width: "100%",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      {listing && (
        <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
          <p className="text-2xl font-semibold">
            {listing.name} - ${" "}
            {listing.offer && listing.discountedPrice
              ? listing.discountedPrice.toLocaleString("en-US")
              : listing.regularPrice &&
                listing.regularPrice.toLocaleString("en-US")}
            {listing.type === "rent" && " / month"}
          </p>
          <p className="flex items-center mt-6 gap-2 text-slate-600  text-sm">
            <FaMapMarkerAlt className="text-green-700" />
            {listing.address}
          </p>
          <div className="flex gap-4">
            <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
              {listing.type === "rent" ? "For Rent" : "For Sale"}
            </p>
            {listing.offer && (
              <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                ${+listing.regularPrice - +listing.discountedPrice} OFF
              </p>
            )}
          </div>
          <p className="text-slate-800">
            <span className="font-semibold text-black">Description - </span>
            {listing.description}
          </p>
          <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
            <li className="flex items-center gap-1 whitespace-nowrap ">
              <FaBed className="text-lg" />
              {listing.beds > 1
                ? `${listing.beds} beds `
                : `${listing.beds} bed `}
            </li>
            <li className="flex items-center gap-1 whitespace-nowrap ">
              <FaBath className="text-lg" />
              {listing.baths > 1
                ? `${listing.baths} baths `
                : `${listing.baths} bath `}
            </li>
            <li className="flex items-center gap-1 whitespace-nowrap ">
              <FaParking className="text-lg" />
              {listing.parking ? "Parking spot" : "No Parking"}
            </li>
            <li className="flex items-center gap-1 whitespace-nowrap ">
              <FaChair className="text-lg" />
              {listing.furnished ? "Furnished" : "Unfurnished"}
            </li>
          </ul>
          {currentUser && listing.userRef !== currentUser._id && !contact && (
            <button
              onClick={() => setContact(true)}
              className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
            >
              Contact landlord
            </button>
          )}
          {contact && <Contact listing={listing} />}
        </div>
      )}
    </main>
  );
};

export default Listing;
