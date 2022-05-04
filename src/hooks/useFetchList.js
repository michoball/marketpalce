import { useState, useCallback } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  startAfter,
} from "firebase/firestore";

import { db } from "../firebase.config";

function useFetchList() {
  // const [listData, setListData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchingListings = useCallback(
    async (whereField, whereValue, applyData, limitNum) => {
      try {
        const listingsRef = collection(db, "listings");

        const q = query(
          listingsRef,
          where(
            whereField,
            whereField === "timestamp" ? "!=" : "==",
            whereValue
          ),
          orderBy("timestamp", "desc"),

          limit(limitNum || 10)
        );

        const querySnap = await getDocs(q);

        applyData(querySnap);
        setLoading(false);
      } catch (error) {
        setError(error);
      }
    },
    []
  );

  const fetchingPagenation = useCallback(
    async (whereField, whereValue, applyData, lastFetchedList, limitNum) => {
      try {
        const listingsRef = collection(db, "listings");

        const q = query(
          listingsRef,
          where(
            whereField,
            whereField === "timestamp" ? "!=" : "==",
            whereValue
          ),
          orderBy("timestamp", "desc"),
          startAfter(lastFetchedList),
          limit(limitNum || 10)
        );

        const querySnap = await getDocs(q);

        applyData(querySnap);
      } catch (error) {
        setError(error);
      }
    },
    []
  );

  return { error, loading, fetchingListings, fetchingPagenation };
}

export default useFetchList;

// where("type", "==", params.categoryName),
// startAfter(lastFetchedListing),
//
