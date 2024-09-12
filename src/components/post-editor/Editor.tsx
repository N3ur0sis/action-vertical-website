import React from "react";
import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/js/plugins/video.min.js";
import "froala-editor/js/plugins/image.min.js";
import "froala-editor/js/plugins/file.min.js";
import "froala-editor/js/plugins/link.min.js";
import "froala-editor/js/plugins/table.min.js";
import "froala-editor/js/plugins/paragraph_format.min.js";
import "froala-editor/js/plugins/font_family.min.js";
import "froala-editor/js/plugins/font_size.min.js";
import "froala-editor/js/plugins/colors.min.js";  // Plugin pour les couleurs


const Editor = ({ model, setModel }) => {
  return (
    <FroalaEditor
      model={model}
      onModelChange={(e) => setModel(e)}
      config={{
        height: 400,
        placeholderText: "Commencez à écrire votre article...",
        pluginsEnabled: [
          "image",
          "file",
          "link",
          "table",
          "lists",
          "paragraphFormat",
          "align",
          "fontFamily",
          "fontSize",
          "colors",  // Activer le plugin pour les couleurs
          "quote",
          "video",
        ],
        toolbarButtons: [
          "bold", "italic", "underline", "strikeThrough", "subscript", "superscript",
          "fontFamily", "fontSize", "textColor", "backgroundColor", // Utilisation de "textColor" pour la couleur du texte
          "inlineStyle", "paragraphStyle",
          "paragraphFormat", "align", "formatOL", "formatUL", "outdent", "indent",
          "quote", "insertLink", "insertImage", "insertVideo", "insertFile",
          "insertTable", "emoticons", "specialCharacters", "insertHR",
          "clearFormatting", "html", "fullscreen"
        ],
        fileUploadURL: "/api/upload_file",
        imageUploadURL: "/api/upload_image?type=froala",
        fileAllowedTypes: [
          "application/pdf", 
          "text/plain", 
          "application/msword", 
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ],
        imageAllowedTypes: ["jpeg", "jpg", "png", "gif"],
        events: {
          "file.uploaded": function (response) {
            const fileUrl = JSON.parse(response).link;
            const fileName = fileUrl.split("/").pop();
            
            if (fileUrl.endsWith(".pdf")) {
              this.html.insert(
                `<iframe src="${fileUrl}" style="width:100%;height:500px;" frameborder="0"></iframe>`
              );
            } else {
              this.html.insert(
                `<a href="${fileUrl}" target="_blank" style="color: blue; text-decoration: underline; font-weight: bold;">${fileName}</a>`
              );
            }
          },
          "file.error": function (error, response) {
            console.error("Erreur lors de l'upload du fichier:", error, response);
          },
          "image.uploaded": function (response) {
            const responseData = JSON.parse(response);
            if (responseData.urls && responseData.urls.length > 0) {
              const imageUrl = responseData.urls[0];
              this.html.insert(`<img src="${imageUrl}" style="width:100%;height:auto;" alt="Image insérée"/>`);
            } else {
              console.error("No link in upload response.");
            }
          },
          "image.error": function (error, response) {
            console.error("Erreur lors de l'upload de l'image:", error, response);
          },
        },
      }}
    />
  );
};

export default Editor;
