"use client";

import React, { useState } from "react";
import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/js/plugins/image.min.js";

import "froala-editor/css/froala_editor.pkgd.min.css";
import { createPost } from "@/actions/actions";
import { link } from "fs";

export default function PostEditor() {
  const [model, setModel] = useState("");
  console.log(model);
  return (
    <main className=" mx-auto max-w-[850px]">
      <form
        action={(event) => createPost(event, model)}
        className="flex flex-col max-w-[400px] gap-2 mx-auto my-10"
      >
        <input
          type="text"
          name="title"
          placeholder="Titre du nouvel article"
          required
          className="border rounded px-3 h-10"
        ></input>

        <FroalaEditor
          model={model}
          onModelChange={(e: string) => setModel(e)}
        />
        <button className="rounded bg-blue-500 h-10 px-5 text-white">
          Publier
        </button>
      </form>
    </main>
   );
}
