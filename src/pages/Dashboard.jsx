import React, { useEffect, useState } from "react";
import { api } from "../api";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import "./Dashboard.css";

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
    <div className="dashboard">
      <Navbar />
      <div className="dashboard__content">
        <div className="dashboard__header">
          <h2 className="dashboard__title">Albums</h2>

          <div className="albumForm" aria-label="Create album">
            <input
              className="field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Album name"
            />

            <input
              className="field"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Album description"
            />

            <button className="btn btn--primary" onClick={createAlbum}>
              Create Album
            </button>
          </div>
        </div>

        {error && <p className="dashboard__error">{error}</p>}

        {albums.length > 0 ? (
          <div className="albumGrid">
            {albums.map((album) => (
              <div className="albumCard" key={album.albumId}>
                <div className="albumCard__header">
                  <h3 className="albumCard__title">
                    <Link className="albumCard__link" to={`/album/${album.albumId}`}>
                      {album.name}
                      <span className="albumCard__chev" aria-hidden="true">
                        →
                      </span>
                    </Link>
                  </h3>
                </div>

                <div className="albumCard__body">
                  <div className="albumCard__section">
                    <div className="albumCard__label">Description:</div>
                    <div className="albumCard__value">
                      {album.description?.trim() ? album.description : "No description"}
                    </div>
                  </div>

                  <div className="albumCard__section">
                    <div className="albumCard__label">Shared with:</div>
                    {album.sharedWith?.length > 0 ? (
                      <div className="albumCard__chips" aria-label="Shared users">
                        {album.sharedWith.slice(0, 6).map((email) => (
                          <span className="chip" key={email}>
                            {email}
                          </span>
                        ))}
                        {album.sharedWith.length > 6 && (
                          <span className="chip chip--muted">+{album.sharedWith.length - 6}</span>
                        )}
                      </div>
                    ) : (
                      <div className="albumCard__value albumCard__value--muted">Not shared yet</div>
                    )}
                  </div>

                  <div className="albumCard__divider" />

                  <div className="albumCard__actions" aria-label="Album actions">
                    <div className="albumCard__actionBlock">
                      <div className="albumCard__label">Update description:</div>
                      <div className="albumCard__row">
                        <input
                          type="text"
                          placeholder="Write a new description…"
                          className="field field--sm"
                          value={editDescription[album.albumId] || ""}
                          onChange={(e) =>
                            setEditDescription((prev) => ({
                              ...prev,
                              [album.albumId]: e.target.value,
                            }))
                          }
                        />
                        <button
                          className="btn btn--secondary btn--sm"
                          onClick={() => updateAlbumDescription(album.albumId)}
                        >
                          Save
                        </button>
                      </div>
                    </div>

                    <div className="albumCard__actionBlock">
                      <div className="albumCard__label">Share album:</div>
                      <div className="albumCard__row">
                        <select
                          className="field field--sm"
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
                          className="btn btn--secondary btn--sm"
                          onClick={() => shareAlbum(album.albumId)}
                        >
                          Share
                        </button>
                      </div>
                    </div>

                    <div className="albumCard__footerRow">
                      <button
                        onClick={() => deleteAlbum(album.albumId)}
                        className="btn btn--danger btn--sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="dashboard__empty">No albums found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
