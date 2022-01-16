import { EnvConfigService } from "src/configs/env.config";
import { UserModel } from "./users";

export class Models {
    public UserModel: UserModel;
    private config: EnvConfigService;
    constructor() {
        this.config = new EnvConfigService();
        this.UserModel = new UserModel(this.config);
    }
}