import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import Spinner from "./Spinner";
import useFetchList from "../hooks/useFetchList";

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

function Slider() {
  const [listings, setListings] = useState(null);
  // const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // eslint-disable-next-line no-unused-vars
  const { error, loading, fetchingListings } = useFetchList();

  useEffect(() => {
    const attachData = (querySnap) => {
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listings);
    };

    fetchingListings("timestamp", false, attachData, 5);

    // const fetchingListings = async () => {
    //   const listingRef = collection(db, "listings");
    //   const q = query(
    //     listingRef,
    //     orderBy("timestamp", "desc"),
    //     limit(5)
    //   );
    //   const querySnap = await getDocs(q);

    //   let listings = [];
    //   querySnap.forEach((doc) => {
    //     return listings.push({
    //       id: doc.id,
    //       data: doc.data(),
    //     });
    //   });

    //   setListings(listings);
    //   setLoading(false);
    // };
    // fetchingListings();
  }, [fetchingListings]);

  if (loading) {
    return <Spinner />;
  }

  if (listings.length === 0) {
    return <></>;
  }
  return (
    listings && (
      <>
        <p className="exploreHeading">Recommended</p>

        <Swiper
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          slidesPerView={1}
          pagination={{ clickable: true }}
        >
          {listings.map(({ data, id }) => (
            <SwiperSlide
              key={id}
              onClick={() => {
                navigate(`/category/${data.type}/${id}`);
              }}
            >
              <div
                style={{
                  background: `url(${data.imgUrls[0]}) no-repeat center`,
                  backgroundSize: "cover",
                }}
                className="swiperSlideDiv"
              ></div>
              <p className="swiperSlideText">{data.name}</p>
              <p className="swiperSlidePrice">
                ${data.discountedPrice ?? data.regularPrice}
                {data.type === "rent" && "/ Month"}
              </p>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
}

export default Slider;
