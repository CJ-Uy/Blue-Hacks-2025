"use client";

import { useRef } from "react";

export default function Page() {
  const inputFileRef = useRef(null);
  return (
    <>
      <h1>Report Damages</h1>
      <div className="bg-slate-400">
        {/* This form was partially created using Generative AI */}
        <form
          onSubmit={async (event) => {
            event.preventDefault();

            const formData = new FormData(event.target);
            
            const files = inputFileRef.current.files;
            for (const file of Array.from(files)){
              formData.append("files", file);
            }

            const savedReport = await fetch("/api/report/save", {
              method: "POST",
              body: formData,
            });
          }}
        >
          <label for="description">Description:</label>
          <br />
          <input type="text" name="description" />
          <br />

          <label for="lat">Lat</label>
          <br />
          <input type="number" name="lat" />
          <br />
          <label for="lon">Lon</label>
          <br />
          <input type="number" name="lon" />
          <br />

          <input name="file" ref={inputFileRef} type="file" multiple />
          <br />
          <button type="submit">Upload</button>
        </form>
      </div>
    </>
  );
}
