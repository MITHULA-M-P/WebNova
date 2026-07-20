import "./BrowserPreview.css";
import {  type Template } from "../../data/templates";

interface BrowserPreviewProps {
  template: Template;
}

function BrowserPreview({ template }: BrowserPreviewProps) {
  return (
    <div className="browser-preview">

      <div className="browser-header">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="browser-content">

        <div className="preview-navbar">
          <div className="preview-logo"></div>

          <div className="preview-menu">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>

        <div className={`preview-hero ${template.name.toLowerCase()}`}>

          <h2>{template.name} Website</h2>

        </div>

        <div className="preview-cards">

          <div></div>

          <div></div>

          <div></div>

        </div>

      </div>

    </div>
  );
}

export default BrowserPreview;