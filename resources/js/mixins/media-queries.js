import config from '../modules/config.js'

export default {

    props: {

        mediaQueries: {
            type: Object,
            default() {
                return this._config.mediaQueries
            }
        }
    },


    data() {
        return {
            matchedMedia: []
        }
    },


    methods: {

        _getMediaName(media) {
            return Object.keys(this.mediaQueries).find(item => this.mediaQueries[item] === media)
        },

        _checkMediaMatch(mediaStr) {
            return mediaStr.split(',').some(media => {
                return this.matchedMedia.includes(media.trim())
            })
        },

        onMatchMedia($event) {
            let name = this._getMediaName($event.media);
            let index = this.matchedMedia.indexOf(name);
            if ($event.matches && !~index) {
                this.matchedMedia.push(name)
            }
            if (!$event.matches && ~index) {
                this.matchedMedia.splice(index, 1)
            }
        }
    },


    beforeMount() {
        this._mq = {}
        for (let name in this.mediaQueries) {
            try {
                this._mq[name] = window.matchMedia(this.mediaQueries[name])
                if (this._mq[name].matches) this.matchedMedia.push(name)
                this._mq[name].addListener(this.onMatchMedia)
            } catch (error) {
                console.log('Table builder: ', error);
            }
        }
    },


    beforeDestroy() {
        if (!this._mq) return
        for (let name in this._mq) {
            this._mq[name].removeListener(this.onMatchMedia)
        }
    }
}