import React, { useRef, useState } from "react";
import { uploadImageApi } from "../api";
import "./Upload.css";

const Upload = ({ albumId, refresh }) => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState("");
  const [person, setPerson] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState("");

  const uploadImage = async () => {
    try {
      setError("");

      if (!file) {
        setError("Please select an image.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "tags",
        JSON.stringify(
          tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        )
      );
      formData.append("person", person);
      formData.append("isFavorite", String(isFavorite));

      await uploadImageApi(albumId, formData);

      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setTags("");
      setPerson("");
      setIsFavorite(false);
      refresh();
    } catch (err) {
      setError(err.message || "Failed to upload image.");
    }
  };

  return (
    <section className="uploadPanel" aria-label="Upload image">
      <h2 className="uploadPanel__title">Upload</h2>

      <div className="uploadPanel__row">
        <input
          ref={fileInputRef}
          className="uploadPanel__file"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      <div className="uploadPanel__row uploadPanel__row--split">
        <input
          className="uploadPanel__field"
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <input
          className="uploadPanel__field"
          type="text"
          placeholder="Person name"
          value={person}
          onChange={(e) => setPerson(e.target.value)}
        />
      </div>

      <label className="uploadPanel__label">
        <input
          type="checkbox"
          checked={isFavorite}
          onChange={(e) => setIsFavorite(e.target.checked)}
        />
        Mark as favorite
      </label>

      <div className="uploadPanel__actions">
        <button type="button" className="uploadPanel__btn" onClick={uploadImage}>
          Upload image
        </button>
      </div>

      {error ? <p className="uploadPanel__error">{error}</p> : null}
    </section>
  );
};

export default Upload;
