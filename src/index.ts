import { App } from "./app";

class Server {
    private app: App;
    constructor() {
        this.app = new App();
        this.app.start();
    }
}
new Server();