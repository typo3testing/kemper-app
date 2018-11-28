import React from "react";

import ThumbnailWidget from "./widgets/thumbnail.jsx";
import ListWidget from "./widgets/list.jsx";

export default props => {
  switch (props.type) {
    case "material":
      return <ThumbnailWidget {...props} />;
    default:
      return <ListWidget {...props} />;
  }
};
