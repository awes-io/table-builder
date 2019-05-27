import config from '../modules/config.js'

export default {

    beforeCreate() {
        this._config = Object.assign(config, _.pick(AWES._config.tableBuilder, Object.keys(config)))
    }
}