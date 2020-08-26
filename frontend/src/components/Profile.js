import React from "react";

const Profile = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [userMetadata, setUserMetadata] = useState(null);

  useEffect(() => {
    const getUserMetadata = async () => {
      const domain = "notes-api.us.auth0.com";

      try {
        const accessToken = await getAccessTokenSilently();

        const userDetailsByIdUrl = "http://localhost:5000/api/notes";

        fetch("https://notes-api.us.auth0.com/userinfo", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
          .then((results) => results.json())
          .then((data) => console.log(data));

        fetch(userDetailsByIdUrl, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setUserMetadata(data);
          });
      } catch (e) {
        console.log(e.message);
      }
    };

    getUserMetadata();
  }, []);

  return (
    isAuthenticated && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <h3>User Metadata</h3>
        {userMetadata ? (
          <pre>{JSON.stringify(userMetadata, null, 2)}</pre>
        ) : (
          "No user metadata defined"
        )}
      </div>
    )
  );
};

export default Profile;
