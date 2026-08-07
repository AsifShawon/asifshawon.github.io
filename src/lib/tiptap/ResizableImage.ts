import Image from "@tiptap/extension-image";
import type { NodeViewRenderer } from "@tiptap/core";

/**
 * Extends the stock Image node with a drag-to-resize handle, rendered via a
 * plain-DOM NodeView (no React) since Tiptap v2's core NodeView API doesn't
 * need it. Width is persisted on the node so it round-trips through
 * editor.getJSON() / setContent(). The handle only mounts when the editor is
 * editable, so it's inert on the public read-only blog render.
 */
const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        renderHTML: (attrs) => (attrs.width ? { width: attrs.width } : {}),
      },
      height: {
        default: null,
        renderHTML: (attrs) => (attrs.height ? { height: attrs.height } : {}),
      },
    };
  },

  addNodeView(): NodeViewRenderer {
    return ({ node, editor, getPos }) => {
      const container = document.createElement("div");
      container.className = "resizable-image";
      container.style.position = "relative";
      container.style.display = "inline-block";
      container.style.maxWidth = "100%";

      const img = document.createElement("img");
      img.src = node.attrs.src;
      if (node.attrs.alt) img.alt = node.attrs.alt;
      img.style.display = "block";
      img.style.maxWidth = "100%";
      img.style.borderRadius = "0.5rem";
      img.style.width = node.attrs.width ? `${node.attrs.width}px` : "100%";
      if (node.attrs.height) img.style.height = `${node.attrs.height}px`;

      container.appendChild(img);

      if (!editor.isEditable) {
        return { dom: container };
      }

      const handle = document.createElement("div");
      handle.className = "resizable-image__handle";
      container.appendChild(handle);

      let startX = 0;
      let startWidth = 0;

      const onMouseMove = (event: MouseEvent) => {
        const delta = event.clientX - startX;
        const newWidth = Math.max(80, Math.round(startWidth + delta));
        img.style.width = `${newWidth}px`;
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        if (typeof getPos === "function") {
          const width = Math.round(img.getBoundingClientRect().width);
          editor.view.dispatch(
            editor.view.state.tr.setNodeMarkup(getPos(), undefined, {
              ...node.attrs,
              width,
            })
          );
        }
      };

      handle.addEventListener("mousedown", (event) => {
        event.preventDefault();
        startX = event.clientX;
        startWidth = img.getBoundingClientRect().width;
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      });

      return {
        dom: container,
        update: (updatedNode) => {
          if (updatedNode.type.name !== "image") return false;
          img.src = updatedNode.attrs.src;
          if (updatedNode.attrs.width) img.style.width = `${updatedNode.attrs.width}px`;
          return true;
        },
      };
    };
  },
});

export default ResizableImage;
