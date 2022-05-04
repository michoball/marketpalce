import { useState, useEffect } from "react";
import { getAuth, signOut, updateProfile, updateEmail } from "firebase/auth";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { Link, useNavigate } from "react-router-dom";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem";
import useFetchList from "../hooks/useFetchList";

function Profile() {
  const navigate = useNavigate();
  const auth = getAuth();
  // const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;
  const { error, loading, fetchingListings: fetchList } = useFetchList();
  const onLogout = () => {
    signOut(auth);
    navigate("/sign-in");
  };

  useEffect(() => {
    const attachData = (querySnap) => {
      const listing = [];

      querySnap.forEach((doc) => {
        return listing.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listing);
    };

    fetchList("userRef", auth.currentUser.uid, attachData);
    // const fetchingListings = async () => {
    //   const listingsRef = collection(db, "listings");
    //   const q = query(
    //     listingsRef,
    //     where("userRef", "==", auth.currentUser.uid),
    //     orderBy("timestamp", "desc"),
    //     limit(10)
    //   );

    //   const querySnap = await getDocs(q);

    //   const listings = [];

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
  }, [auth.currentUser.uid, fetchList]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          name: name,
        });
      }
      if (auth.currentUser.email !== email) {
        await updateEmail(auth.currentUser, email);
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          email: email,
        });
      }
      toast.success("Update is completed!");
    } catch (error) {
      const errorCode = error.code;
      toast.error(`Could not update profile details ${errorCode}`);
    }
  };

  const onDelete = async (listingId) => {
    if (window.confirm("Are you sure?")) {
      const docRef = doc(db, "listings", listingId);
      await deleteDoc(docRef);
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingId
      );
      setListings(updatedListings);
      toast.success("listing deleted!!");
    }
  };

  const onEdit = (listingId) => {
    navigate(`/edit-listing/${listingId}`);
  };

  if (error) {
    console.log(error);
  }
  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type="button" className="logOut" onClick={onLogout}>
          Logout
        </button>
      </header>

      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? "done" : "Change"}
          </p>
        </div>

        <div className="profileCard">
          <form>
            <input
              type="text"
              id="name"
              disabled={!changeDetails}
              className={!changeDetails ? "profileName" : "profileNameActive"}
              value={name}
              onChange={onChange}
            />
            <input
              type="email"
              id="email"
              disabled={!changeDetails}
              className={!changeDetails ? "profileEmail" : "profileEmailActive"}
              value={email}
              onChange={onChange}
            />
          </form>
        </div>
        <Link to="/create-listing" className="createListing">
          <img src={homeIcon} alt="home" />
          <p>Sell or rent your home</p>
          <img src={arrowRight} alt="arrow right" />
        </Link>

        {/* listings 자리 delete edit 기능 추가*/}
        {!loading && listings?.length > 0 && (
          <>
            <p className="listingText">Your Listings</p>
            <ul className="listingList">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}

export default Profile;
