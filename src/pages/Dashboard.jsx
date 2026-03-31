import React, { useEffect, useState } from "react";
import { api } from "../api";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [albums, setAlbums] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [shareEmail, setShareEmail] = useState({});
  const [editDescription, setEditDescription] = useState({});
  const [error, setError] = useState("");
  const [allUsers, setAllUsers] = useState([]); 

  const fetchAlbums = async () => {
    try {
      setError("");
      const data = await api("/albums");
      setAlbums(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch albums.");
      toast.error("Failed to fetch albums.");
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await api("/kaviosUsers"); 
      setAllUsers(Array.isArray(data) ? data.filter(user => user.email) : []);
    } catch (err) {
      toast.error("Failed to fetch users.");
    }
  };

  const createAlbum = async () => {
    try {
      setError("");

      if (!name.trim()) {
        setError("Album name is required.");
        toast.warn("Album name is required.");
        return;
      }

      await api("/albums", "POST", {
        name,
        description,
      });

      setName("");
      setDescription("");
      fetchAlbums();
      toast.success("Album created successfully!");
    } catch (err) {
      setError(err.message || "Failed to create album.");
      toast.error("Failed to create album.");
    }
  };

  const updateAlbumDescription = async (albumId) => {
    try {
      setError("");

      await api(`/albums/${albumId}`, "PUT", {
        description: editDescription[albumId] || "",
      });

      setEditDescription((prev) => ({ ...prev, [albumId]: "" }));

      fetchAlbums();
      toast.info("Album description updated.");
    } catch (err) {
      setError(err.message || "Failed to update description.");
      toast.error("Failed to update description.");
    }
  };

  const shareAlbum = async (albumId) => {
    try {
      setError("");

      const email = shareEmail[albumId]?.trim();
      if (!email) {
        setError("Please select a user to share.");
        toast.warn("Please select a user to share.");
        return;
      }

      await api(`/albums/${albumId}/share`, "POST", {
        emails: [email],
      });

      setShareEmail((prev) => ({ ...prev, [albumId]: "" }));
      fetchAlbums();
      toast.success("Album shared successfully!");
    } catch (err) {
      setError(err.message || "Failed to share album.");
      toast.error("Failed to share album.");
    }
  };

  const deleteAlbum = async (albumId) => {
    try {
      setError("");
      await api(`/albums/${albumId}`, "DELETE");
      fetchAlbums();
      toast.success("Album deleted.");
    } catch (err) {
      setError(err.message || "Failed to delete album.");
      toast.error("Failed to delete album.");
    }
  };

  useEffect(() => {
    fetchAlbums();
    fetchUsers(); 
  }, []);

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <h2>Albums</h2>

          <div style={{ marginBottom: "20px", width: "100%", maxWidth: "400px" }}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Album name"
              style={{ width: "100%", marginBottom: "12px" }}
            />

            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Album description"
              style={{ width: "100%", marginBottom: "12px" }}
            />

            <button onClick={createAlbum}>Create Album</button>
          </div>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {albums.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "16px",
            }}
          >
            {albums.map((album) => (
              <div
                key={album.albumId}
                style={{
                  border: "1px solid #ccc",
                  padding: "12px",
                  borderRadius: "8px",
                  background: "#fafafa",
                }}
              >
                <h3>
                  <Link to={`/album/${album.albumId}`}>{album.name}</Link>
                </h3>

                <p>
                  <strong>Description:</strong>{" "}
                  {album.description || "No description"}
                </p>

                <p>
                  <strong>Shared With:</strong>{" "}
                  {album.sharedWith?.length > 0
                    ? album.sharedWith.join(", ")
                    : "No shared users"}
                </p>

                <input
                  type="text"
                  placeholder="Update description"
                  value={editDescription[album.albumId] || ""}
                  onChange={(e) =>
                    setEditDescription((prev) => ({
                      ...prev,
                      [album.albumId]: e.target.value,
                    }))
                  }
                />
                <button
                  onClick={() => updateAlbumDescription(album.albumId)}
                  style={{ marginLeft: "8px" }}
                >
                  Update Description
                </button>

                <br />
                <br />

                <select
                  value={shareEmail[album.albumId] || ""}
                  onChange={(e) =>
                    setShareEmail((prev) => ({
                      ...prev,
                      [album.albumId]: e.target.value,
                    }))
                  }
                >
                  <option value="">Select user</option>
                  {allUsers.map((user) => (
                    <option key={user.userId} value={user.email}>
                      {user.email}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => shareAlbum(album.albumId)}
                  style={{ marginLeft: "8px" }}
                >
                  Share Album
                </button>

                <br />
                <br />

                <button
                  onClick={() => deleteAlbum(album.albumId)}
                  style={{
                    background: "crimson",
                    color: "white",
                    padding: "6px 10px",
                  }}
                >
                  Delete Album
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No albums found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
