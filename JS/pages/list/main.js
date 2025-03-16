import { manageLoginStatus } from "../../utils/login.js";
import { initListModule } from "./list.js";


document.addEventListener('DOMContentLoaded', function () {

    manageLoginStatus();
    initListModule();
});