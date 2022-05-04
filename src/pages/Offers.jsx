import { useState, useEffect } from "react";

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
import useFetchList from "../hooks/useFetchList";

function Category() {
  // const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  // eslint-disable-next-line no-unused-vars
  const { error, loading, fetchingListings, fetchingPagenation } =
    useFetchList();

  useEffect(() => {
    try {
      const attachData = (querySnap) => {
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListing(lastVisible);

        const listings = [];

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListing(listings);
      };

      fetchingListings("offer", true, attachData);
    } catch (error) {
      console.log(error);
      toast.error("Could not fetch listings");
    }

    // const fetchListings = async () => {
    //   try {
    //     const listingsRef = collection(db, "listings");

    //     const q = query(
    //       listingsRef,
    //       where("offer", "==", true),
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
  }, [fetchingListings]);

  const fetchMoreListings = async () => {
    try {
      const attachData = (querySnap) => {
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListing(lastVisible);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListing((prevState) => [...prevState, ...listings]);
      };
      fetchingPagenation("offer", true, attachData, lastFetchedListing, 10);
    } catch (error) {
      console.log(error);
      toast.error("Could not fetch More listings");
    }

    // try {
    //   const listingsRef = collection(db, "listings");

    //   const q = query(
    //     listingsRef,
    //     where("offer", "==", true),
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

  return (
    <div className="category">
      <header>
        <p className="pageHeader">Offers</p>
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
          )}
        </>
      ) : (
        <p>No listing for offer</p>
      )}
    </div>
  );
}

export default Category;
