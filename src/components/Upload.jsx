import React, { useState } from "react";
import { uploadImageApi } from "../api";

const Upload = ({ albumId, refresh }) => {
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
      setTags("");
      setPerson("");
      setIsFavorite(false);
      refresh();
    } catch (err) {
      setError(err.message || "Failed to upload image.");
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>Upload Image</h3>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <br />
      <br />

      <input
        type="text"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <br />
      <br />

      <input
        type="text"
        placeholder="Person name"
        value={person}
        onChange={(e) => setPerson(e.target.value)}
      />
      <br />
      <br />

      <label>
        Favorite:
        <input
          type="checkbox"
          checked={isFavorite}
          onChange={(e) => setIsFavorite(e.target.checked)}
          style={{ marginLeft: "8px" }}
        />
      </label>
      <br />
      <br />

      <button onClick={uploadImage}>Upload</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Upload;