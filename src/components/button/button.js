import Button from "./button.jsx";
import EdgeButton from "./edge-button.jsx";

import { isEdge } from "../../utils/is-edge";

export default isEdge(EdgeButton)(Button);
