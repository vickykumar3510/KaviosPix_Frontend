import React, { useEffect, useState } from "react";
import { api } from "../api";
import { useParams, Link } from "react-router-dom";
import Upload from "../components/Upload";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import "./Album.css";

const formatUploadedAt = (value) =>
  new Date(value).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

const Album = () => {
  const backendBase =
    import.meta.env.VITE_BACKEND_URL ||
    "https://kaviospix-backend-m6eg.onrender.com";

  const { id } = useParams();
  const [images, setImages] = useState([]);
  const [comments, setComments] = useState({});
  const [tagSearch, setTagSearch] = useState("");
  const [error, setError] = useState("");
  const [lightbox, setLightbox] = useState(null);

  const closeLightbox = () => setLightbox(null);

  const openLightbox = (img) => {
    if (!img?.filePath) return;
    setLightbox({
      src: `${backendBase}/${img.filePath}`,
      alt: img.name || "Album image",
    });
  };

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

  useEffect(() => {
    if (!lightbox) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox]);

  return (
    <div className="albumPage">
      <Navbar />
      <div className="albumPage__content">
        <header className="albumPage__header">
          <Link className="albumPage__back" to="/">
            ← Back to albums
          </Link>
          <h1 className="albumPage__title">Album Images</h1>
          <p className="albumPage__subtitle">Upload photos, search by tags, and manage favorites.</p>
        </header>

        <div className="albumPage__toolbar">
          <Upload
            albumId={id}
            refresh={() => {
              fetchImages(tagSearch);
              toast.success("Image added.");
            }}
          />

          <div className="albumPage__filters" aria-label="Filter images">
            <div className="albumPage__filtersRow">
              <input
                className="albumPage__field"
                type="text"
                placeholder="Search by tags…"
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
              />
              <button
                type="button"
                className="albumPage__btn albumPage__btn--primary"
                onClick={() => fetchImages(tagSearch)}
              >
                Search
              </button>
            </div>
            <div className="albumPage__filterActions">
              <button type="button" className="albumPage__btn" onClick={fetchFavorites}>
                Favorites only
              </button>
              <button
                type="button"
                className="albumPage__btn"
                onClick={() => {
                  setTagSearch("");
                  fetchImages();
                }}
              >
                Show all
              </button>
            </div>
          </div>
        </div>

        {error && <p className="albumPage__error">{error}</p>}

        {images.length > 0 ? (
          <div className="albumPage__grid">
            {images.map((img) => (
              <article className="albumImgCard" key={img.imageId}>
                <div className="albumImgCard__media">
                  {img.filePath ? (
                    <button
                      type="button"
                      className="albumImgCard__thumbBtn"
                      onClick={() => openLightbox(img)}
                      aria-label={`Open larger view: ${img.name || "image"}`}
                    >
                      <img
                        className="albumImgCard__img"
                        src={`${backendBase}/${img.filePath}`}
                        alt={img.name || "Album image"}
                      />
                    </button>
                  ) : null}
                  {img.isFavorite ? (
                    <span className="albumImgCard__favBadge">★ Favorite</span>
                  ) : null}
                </div>

                <h2 className="albumImgCard__name">{img.name || "Untitled"}</h2>

                <div className="albumImgCard__meta">
                  <div>
                    <span className="albumImgCard__metaLabel">Person:</span>{" "}
                    {img.person || "—"}
                  </div>
                  <div>
                    <span className="albumImgCard__metaLabel">Size:</span>{" "}
                    {img.sizeMB != null ? `${img.sizeMB} MB` : "—"}
                  </div>
                  <div>
                    <span className="albumImgCard__metaLabel">Uploaded:</span>{" "}
                    {img.uploadedAt ? formatUploadedAt(img.uploadedAt) : "—"}
                  </div>
                  <div>
                    <span className="albumImgCard__metaLabel">Comments:</span>{" "}
                    {img.comments?.length ? img.comments.join(" · ") : "None"}
                  </div>
                </div>

                <div className="albumImgCard__tags" aria-label="Tags">
                  {img.tags?.length ? (
                    img.tags.map((tag) => (
                      <span className="albumImgCard__chip" key={tag}>
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="albumImgCard__chip albumImgCard__chip--muted">No tags</span>
                  )}
                </div>

                <div className="albumImgCard__actions">
                  <button
                    type="button"
                    className={`albumImgCard__btn${img.isFavorite ? " albumImgCard__btn--favActive" : ""}`}
                    onClick={() => toggleFavorite(img.imageId, img.isFavorite)}
                  >
                    {img.isFavorite ? "Remove favorite" : "Favorite"}
                  </button>
                  <button
                    type="button"
                    className="albumImgCard__btn albumImgCard__btn--danger"
                    onClick={() => deleteImage(img.imageId)}
                  >
                    Delete
                  </button>
                </div>

                <div className="albumImgCard__commentRow">
                  <input
                    type="text"
                    className="albumPage__field albumImgCard__field"
                    placeholder="Add a comment…"
                    value={comments[img.imageId] || ""}
                    onChange={(e) =>
                      setComments((prev) => ({
                        ...prev,
                        [img.imageId]: e.target.value,
                      }))
                    }
                  />
                  <button type="button" className="albumPage__btn" onClick={() => addComment(img.imageId)}>
                    Add
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="albumPage__empty">No images in this album yet. Upload one above.</p>
        )}
      </div>

      {lightbox ? (
        <div
          className="albumLightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={closeLightbox}
        >
          <div
            className="albumLightbox__panel"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="albumLightbox__close"
              onClick={closeLightbox}
              aria-label="Close image"
            >
              ×
            </button>
            <img
              className="albumLightbox__img"
              src={lightbox.src}
              alt={lightbox.alt}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Album;
