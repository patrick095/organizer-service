import { EnvConfigService } from 'src/configs/env.config';
import { DataModel } from './data';
import { UserModel } from './users';

export class Models {
    public UserModel: UserModel;
    public DataModel: DataModel;
    private config: EnvConfigService;

    constructor() {
        this.config = new EnvConfigService();
        this.UserModel = new UserModel(this.config);
        this.DataModel = new DataModel(this.config);
    }
}
