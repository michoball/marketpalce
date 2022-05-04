import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import useFetchList from "../hooks/useFetchList";
// import {
//   collection,
//   getDocs,
//   query,
//   where,
//   orderBy,
//   limit,
//   startAfter,
// } from "firebase/firestore";
// import { db } from "../firebase.config";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem";

function Category() {
  // const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);
  const params = useParams();

  const {
    error,
    loading,
    fetchingListings: fetchList,
    fetchingPagenation,
  } = useFetchList();

  // costom hook으로 list 다루기
  useEffect(() => {
    const attachData = (querySnap) => {
      const listings = [];
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListing(listings);
    };

    fetchList("type", params.categoryName, attachData);

    // const fetchListings = async () => {
    //   try {
    //     const listingsRef = collection(db, "listings");

    //     const q = query(
    //       listingsRef,
    //       where("type", "==", params.categoryName),
    //       orderBy("timestamp", "desc"),
    //       limit(10)
    //     );

    //     const querySnap = await getDocs(q);
    //     const lastVisible = querySnap.docs[querySnap.docs.length - 1];
    //     setLastFetchedListing(lastVisible);
    //     const listings = [];

    //     querySnap.forEach((doc) => {
    //       return listings.push({
    //         id: doc.id,
    //         data: doc.data(),
    //       });
    //     });

    //     setListing(listings);
    //     setLoading(false);
    //   } catch (error) {
    //     console.log(error);
    //     toast.error("Could not fetch listings");
    //   }
    // };
    // fetchListings();
  }, [params.categoryName, fetchList, error]);

  const fetchMoreListings = async () => {
    try {
      const attachData = (querySnap) => {
        const listings = [];
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListing(lastVisible);
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListing((prevState) => [...prevState, ...listings]);
      };

      fetchingPagenation(
        "type",
        params.categoryName,
        attachData,
        lastFetchedListing,
        10
      );
    } catch (error) {
      console.log(error);
      toast.error("Could not fetch listings");
    }

    // try {
    //   const listingsRef = collection(db, "listings");

    //   const q = query(
    //     listingsRef,
    //     where("type", "==", params.categoryName),
    //     orderBy("timestamp", "desc"),
    //     startAfter(lastFetchedListing),
    //     limit(10)
    //   );

    //   const querySnap = await getDocs(q);
    //   const lastVisible = querySnap.docs[querySnap.docs.length - 1];
    //   setLastFetchedListing(lastVisible);
    //   const listings = [];

    //   querySnap.forEach((doc) => {
    //     return listings.push({
    //       id: doc.id,
    //       data: doc.data(),
    //     });
    //   });

    //   setListing((prevState) => [...prevState, ...listings]);
    // } catch (error) {
    //   console.log(error);
    //   toast.error("Could not fetch listings");
    // }
  };

  if (error) {
    console.log(error);
  }
  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          {params.categoryName === "rent"
            ? "Places for rent"
            : "Places for sale"}
        </p>
      </header>
      {loading ? (
        <Spinner />
      ) : listing && listing.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listing.map((list) => (
                <ListingItem key={list.id} id={list.id} listing={list.data} />
              ))}
            </ul>
          </main>
          <br />
          <br />
          {lastFetchedListing && (
            <p className="loadMore" onClick={fetchMoreListings}>
              Load More
            </p>
          )}{" "}
        </>
      ) : (
        <p>No listing for {params.categoryName}</p>
      )}
    </div>
  );
}

export default Category;
