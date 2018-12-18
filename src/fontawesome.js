import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
// import { fal } from "@fortawesome/free-light-svg-icons";
// import i from '@fortawesome/react-fontawesome'

// Add all icons to the library so you can use it in your page
library.add(fas, far, fab);
dom.watch();
dom.i2svg();