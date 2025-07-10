import * as React from "react";
// import { LoremIpsum } from "react-lorem-ipsum";
import { motion, useDeprecatedInvertedScale } from "framer-motion";

export const ContentPlaceholder = React.memo(() => {
  const inverted = useDeprecatedInvertedScale();
  return (
    <motion.div
      className="content-container"
      style={{ ...inverted, originY: 0, originX: 0 }}
    >
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia dolore quas
      voluptate id voluptas asperiores necessitatibus est, quidem blanditiis
      placeat dicta assumenda earum similique debitis rem modi reiciendis
      voluptatum numquam neque consequatur sed saepe eaque repudiandae! Quis
      quae tenetur magnam, expedita asperiores libero illo saepe inventore?
      Asperiores natus quaerat obcaecati.
    </motion.div>
  );
});

ContentPlaceholder.displayName = "ContentPlaceholder";
