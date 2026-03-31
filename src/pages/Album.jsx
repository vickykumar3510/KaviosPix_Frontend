import React, { useEffect, useState } from "react";
import { api } from "../api";
import { useParams } from "react-router-dom";
import Upload from "../components/Upload";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

const Album = () => {
  const { id } = useParams();
  const [images, setImages] = useState([]);
  const [comments, setComments] = useState({});
  const [tagSearch, setTagSearch] = useState("");
  const [error, setError] = useState("");

  const fetchImages = async (tags = "") => {
    try {
      setError("");
      const endpoint = tags
        ? `/albums/${id}/images?tags=${encodeURIComponent(tags)}`
        : `/albums/${id}/images`;

      const data = await api(endpoint);
      setImages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch images.");
      setImages([]);
      toast.error("Failed to fetch images.");
    }
  };

  const fetchFavorites = async () => {
    try {
      setError("");
      const data = await api(`/albums/${id}/images/favorites`);
      setImages(Array.isArray(data) ? data : []);
      toast.info("Showing favorite images.");
    } catch (err) {
      setError(err.message || "Failed to fetch favorite images.");
      toast.error("Failed to fetch favorites.");
    }
  };

  const toggleFavorite = async (imageId, currentValue) => {
    try {
      await api(`/albums/${id}/images/${imageId}/favorite`, "PUT", {
        isFavorite: !currentValue,
      });
      fetchImages(tagSearch);
      toast.success(!currentValue ? "Marked as favorite." : "Removed from favorites.");
    } catch (err) {
      setError(err.message || "Failed to update favorite.");
      toast.error("Failed to update favorite.");
    }
  };

  const addComment = async (imageId) => {
    try {
      const comment = comments[imageId]?.trim();

      if (!comment) {
        setError("Comment cannot be empty.");
        toast.warn("Comment cannot be empty.");
        return;
      }

      await api(`/albums/${id}/images/${imageId}/comments`, "POST", {
        comment,
      });

      setComments((prev) => ({ ...prev, [imageId]: "" }));
      fetchImages(tagSearch);
      toast.success("Comment added.");
    } catch (err) {
      setError(err.message || "Failed to add comment.");
      toast.error("Failed to add comment.");
    }
  };

  const deleteImage = async (imageId) => {
    try {
      await api(`/albums/${id}/images/${imageId}`, "DELETE");
      fetchImages(tagSearch);
      toast.success("Image deleted.");
    } catch (err) {
      setError(err.message || "Failed to delete image.");
      toast.error("Failed to delete image.");
    }
  };

  useEffect(() => {
    fetchImages();
  }, [id]);

  return (
    <div>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <h2>Album Images</h2>
          <Upload
            albumId={id}
            refresh={() => {
              fetchImages(tagSearch);
              toast.success("Image added.");
            }}
          />

          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Search by tags"
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
              style={{ marginBottom: "12px" }}
            />
            <div>
              <button onClick={() => fetchImages(tagSearch)} style={{ marginLeft: "8px" }}>
                Search Tags
              </button>
              <button onClick={fetchFavorites} style={{ marginLeft: "8px" }}>
                Show Favorites
              </button>
              <button onClick={() => fetchImages()} style={{ marginLeft: "8px" }}>
                Show All
              </button>
            </div>
          </div>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {images.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "16px",
            }}
          >
            {images.map((img) => (
              <div
                key={img.imageId}
                style={{
                  border: "1px solid #ccc",
                  padding: "12px",
                  borderRadius: "8px",
                  background: "#fafafa",
                }}
              >
                {img.filePath && (
                  <img
                    src={`https://kaviospix-backend-m6eg.onrender.com/${img.filePath}`}
                    alt={img.name}
                    style={{
                      width: "100%",
                      height: "200px",
                      marginBottom: "10px",
                      borderRadius: "8px",
                      objectFit: "cover",
                    }}
                  />
                )}

                <p><strong>Name:</strong> {img.name}</p>
                <p><strong>Favorite:</strong> {img.isFavorite ? "Yes" : "No"}</p>
                <p><strong>Tags:</strong> {img.tags?.join(", ") || "No tags"}</p>
                <p><strong>Person:</strong> {img.person || "Not tagged"}</p>
                <p><strong>Comments:</strong> {img.comments?.join(", ") || "No comments"}</p>
                <p><strong>Size:</strong> {img.sizeMB} MB</p>
                <p><strong>Uploaded:</strong> {new Date(img.uploadedAt).toLocaleString()}</p>

                <button onClick={() => toggleFavorite(img.imageId, img.isFavorite)}>
                  {img.isFavorite ? "Unfavorite" : "Favorite"}
                </button>

                <button
                  onClick={() => deleteImage(img.imageId)}
                  style={{
                    marginLeft: "8px",
                    background: "crimson",
                    color: "white",
                    padding: "4px 8px",
                  }}
                >
                  Delete
                </button>

                <br />
                <br />

                <input
                  type="text"
                  placeholder="Add comment"
                  value={comments[img.imageId] || ""}
                  onChange={(e) =>
                    setComments((prev) => ({
                      ...prev,
                      [img.imageId]: e.target.value,
                    }))
                  }
                />
                <button onClick={() => addComment(img.imageId)} style={{ marginLeft: "8px" }}>
                  Add Comment
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No images found.</p>
        )}
      </div>
    </div>
  );
};

export default Album;
